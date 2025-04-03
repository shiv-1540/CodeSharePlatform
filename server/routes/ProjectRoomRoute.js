const express = require('express');
const router = express.Router();
const mailSetup = require('../functions/mailer.js');
const crypto = require('crypto');
const { jwtAuthMiddleware } = require('../middleware/jwtSetup.js');
const upload = require('../functions/multerSetup.js');
const connection = require('../database/mysqlSetup.js');
const fs = require('fs');
const path = require('path');

// const db = require('../database/databaseSetup.js');
// database schemas
const ProjectRoomSchema = require('../model/ProjectRoomSchema');
const User = require('../model/UserSchema.js');
const CodeRoom=require('../model/CodeRoomSchema.js')

// Generate a random room code
const generateRoomCode = () => {
    return crypto.randomBytes(4).toString('hex');
};

// Check if room code already exists in the database
const isRoomCodeUnique = async (roomCode) => {
    const existingRoom = await ProjectRoomSchema.findOne({ roomCode });
    return !existingRoom;
};

// Protect the route with JWT middleware
router.post('/createProject', jwtAuthMiddleware, async (req, res) => {
    const { projectTitle, projectDescription, projectDomain, members, roomPassword } = req.body;
    const userId = req.user.id;

    console.log('user id: ', userId);

    // Generate a unique room code
    let roomCode;
    do {
        roomCode = generateRoomCode();
    } while (!(await isRoomCodeUnique(roomCode)));

    console.log('room code is: ', roomCode);

    const projectRoom = new ProjectRoomSchema({
        title: projectTitle,
        description: projectDescription,
        projectDomain: projectDomain,
        roomPassword: roomPassword,
        members: [{ userId, role: 'creator' }],
        createdAt: new Date(),
        updatedAt: new Date(),
        roomCode: roomCode
    });

    try {
        await projectRoom.save();
        console.log('Success in creating project');

        // Add the created room's ID to the user's createdRooms array
        await User.findByIdAndUpdate(userId, {
            $push: { createdRooms: projectRoom._id }
        });

        // Send emails to members
        try {
            await mailSetup.sendRoomCodeAndPassword(members, roomCode, roomPassword, projectTitle);
        } catch (error) {
            console.error('Failed to send email to members:', error);
        }
        
        res.status(201).json({ message: 'Successfully created' }); // Changed status code to 201 for resource creation
    } catch (err) {
        console.error('Error in creating project:', err); // Use console.error for errors
        res.status(500).json({ message: 'Internal Server Error', error: err.message });
    }
});


// route to get projects created/joined by user
router.get('/getProjectRooms', jwtAuthMiddleware, async (req, res) => {
    const userId = req.user.id;
    console.log(`User ID: ${userId}`);
    
    try {
        const projectRooms = await ProjectRoomSchema.find({
            members: { $elemMatch: { userId: userId } }
        });

        console.log('Project Rooms:', projectRooms);

        if (!projectRooms.length) {
            return res.status(404).json({ message: 'No project rooms found for this user.' });
        }

        const userInfo = await User.findOne({_id: userId});

        res.status(200).json({projectRooms, userInfo});
    } catch (err) {
        console.error('Error fetching project rooms:', err);
        res.status(500).json({ message: 'Internal Server Error', error: err.message });
    }
});


// route to get detail information of any project room
router.get('/getProjectRoomDetail/:roomCode', jwtAuthMiddleware, async (req, res) => {
    const roomCode = req.params.roomCode;  
    const userId = req.user.userId;  

    try {
        if (!roomCode) {
            return res.status(400).json({ message: "Invalid room code" });
        }

        const projectDetails = await ProjectRoomSchema.findOne({ roomCode: roomCode });
        // console.log('project detail: ',projectDetails);

        if (!projectDetails) {
            return res.status(404).json({ message: "Project room not found" });
        }

        console.log('project members: ',projectDetails.members);
        const memberIds = [];
        projectDetails.members.forEach(member => {
            memberIds.push(member.userId);
        });
        console.log('members id: ', memberIds);
        const membersInfo = await User.find({ _id: { $in: memberIds } });

        console.log('membersInfo: ', membersInfo);

        res.json({ projectDetails, membersInfo });
        
    } catch (error) {
        console.error("Error fetching project room details:", error);
        res.status(500).json({ message: "Error fetching project room details" });
    }
});


// Route to join a project room
router.post('/joinProjectRoom', jwtAuthMiddleware, async (req, res) => {
    try {
        const { roomCode, roomPassword } = req.body;
        const userId = req.user.id; 
        const projectRoom = await ProjectRoomSchema.findOne({ roomCode });

        if (!projectRoom) {
            console.log('project room not found')
            return res.status(404).json({ message: "Project room not found" });
        }

        if (projectRoom.roomPassword !== roomPassword) {
            console.log('incorrect password');
            return res.status(401).json({ message: "Incorrect password" });
        }

        if (projectRoom.members.includes(userId)) {
            console.log('User already a member');
            return res.status(400).json({ message: "User is already a member of this project room" });
        }

        projectRoom.members.push({ userId, role: 'collaborator' });
        
        // Save the updated project room document
        await projectRoom.save();

        // Return success message
        res.status(200).json({ message: "Joined project room successfully" });
    } catch (error) {
        // Handle errors
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
});

// route to delete the project card
router.delete("/deleteProjectRoom/:roomId", async (req, res) => {
    const roomId = req.params.roomId;
    console.log(`Room id: ${roomId}`);
    try {
        // Find the project room to be deleted
        const projectRoom = await ProjectRoomSchema.findById(roomId);
        if (!projectRoom) {
            return res.status(404).json({ message: "Project room not found." });
        }
  
        // Gather user emails of all members in the project room
        const memberUserIds = projectRoom.members.map((member) => member.userId);
        const usersToUpdate = await User.find({
            $or: [{ createdRooms: roomId }, { joinedRooms: roomId }],
        });
  
        const userEmails = usersToUpdate.map((user) => user.email);
  
        // Remove the project room reference from each user's createdRooms and joinedRooms
        await User.updateMany(
            { _id: { $in: memberUserIds } },
            {
                $pull: {
                    createdRooms: roomId,
                    joinedRooms: roomId,
                },
            }
        );
  
        // Delete the project room from the ProjectRoom collection
        await ProjectRoomSchema.findByIdAndDelete(roomId);
  
        // Send deletion notifications to all members
        await mailSetup.sendDeletionNotifications(userEmails);
  
        // Respond with a success message and list of notified emails
        res.status(200).json({
            message: "Project room deleted successfully.",
            notifiedEmails: userEmails,
        });
  
    } catch (error) {
        console.error("Error deleting project room:", error);
        res.status(500).json({ message: "An error occurred while deleting the project room." });
    }
});



  
//   // Upload file route
//   router.post('/uploadFile', upload.single('file-upload'), (req, res) => {
//     try {
//       if (!req.file) return res.status(400).send('No file uploaded');
  
    //   const title = req.body.title || path.parse(req.file.originalname).name;
    //   const fileExtension = path.extname(req.file.originalname);
    //   const fileName = `${title}${fileExtension}`;
    //   const fileType = req.file.mimetype;
  
//       const filePath = path.join(__dirname, '../public/uploads', req.file.filename);
//       fs.renameSync(req.file.path, filePath); // Rename to final name if needed
  
//       const query = 'INSERT INTO files_table (file_name, file_type) VALUES (?, ?)';
//       connection.query(query, [fileName, fileType], (error, results) => {
//         if (error) {
//           console.error('Database insertion error:', error);
//           return res.status(500).send('Database error');
//         }
//         res.status(200).json({ message: 'File uploaded and saved to database', fileId: results.insertId });
//       });
//     } catch (error) {
//       console.error('Upload error:', error);
//       res.status(500).send('File upload error');
//     }
//   });
  
  // Get all files with optional filter
  router.get('/getAllData', (req, res) => {
    const { fileType } = req.query;
    let query = 'SELECT * FROM files_table';
    const params = [];
  
    if (fileType && fileType !== 'all') {
      query += ' WHERE file_type = ?';
      params.push(fileType);
    }
  
    connection.query(query, params, (error, results) => {
      if (error) {
        console.error('DB fetch error:', error);
        res.status(500).json({ error });
      } else {
        res.status(200).json(results);
      }
    });
  });
  
  // Delete file route
  router.delete('/deleteFile/:id', (req, res) => {
    const { id } = req.params;
    const fetchFileQuery = 'SELECT file_name, file_type FROM files_table WHERE id = ?';
  
    connection.query(fetchFileQuery, [id], (err, results) => {
      if (err || results.length === 0) {
        return res.status(err ? 500 : 404).json({ error: err ? 'DB error' : 'File not found in database' });
      }
  
      const { file_name } = results[0];
      const filePath = path.join(__dirname, '../public/uploads', file_name);
  
      fs.unlink(filePath, (unlinkErr) => {
        if (unlinkErr) {
          const status = unlinkErr.code === 'ENOENT' ? 404 : 500;
          return res.status(status).json({ error: 'Error deleting file from filesystem' });
        }
  
        const deleteQuery = 'DELETE FROM files_table WHERE id = ?';
        connection.query(deleteQuery, [id], (dbErr) => {
          if (dbErr) return res.status(500).json({ error: 'DB deletion error' });
  
          res.status(200).json({ message: 'File and record deleted successfully' });
        });
      });
    });
});

module.exports = router;
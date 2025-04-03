const express = require('express'); 
const router = express.Router(); 
const GroupMessage = require('../model/GroupMessage');

router.get('/chat/:roomCode', async (req, res) => { 
      try {
         const messages = await GroupMessage.find({ room_code: req.params.roomCode }).sort({ timestamp: 1 }); 
         res.status(200).json(messages); 
        }
        catch (err) { 
            res.status(500).json({ message: 'Failed to fetch messages' });
         } 
    });

module.exports = router;
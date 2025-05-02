const express = require('express');
const http = require('http');
const bodyparser = require('body-parser');
const path = require('path');
const cors = require('cors');
require('dotenv').config();
const port = process.env.PORT || 3000;
const  OpenAI  = require('openai');
const axios = require('axios');

require('dotenv').config();
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });


const userAuthen = require('./routes/AuthenRoutes');
const projectRoom = require('./routes/ProjectRoomRoute');
const fileRoom=require("./routes/FileRoutes");
const groupRoom=require("./routes/GroupChatRoutes");
const database = require('./database/databaseSetup');

const connection = require('./database/mysqlSetup');

const app = express();
const server = http.createServer(app);
const {Server} = require('socket.io');
const io = new Server(server, {
    cors: {
      origin: "http://localhost:5173",
      methods: ["GET", "POST","PUT"],
    },
  });
  
// socketio setup:
// use to track which user got which socket id, so that each has different socket id 
const userSocketMap = {};

const getAllConnectedClients = (roomId) => {
    return Array.from(io.sockets.adapter.rooms.get(roomId) || []).map((socketId) => {
        return {
            socketId,
            username: userSocketMap[socketId],
        }
    }); // map type
}

// socket connection - server side
// same hume client side banana h
io.on("connection", (socket) => {
    console.log("New client connected", socket.id);
  
    // Handle room joining
    socket.on("join", ({ roomId, username }) => {
      socket.join(roomId);
      userSocketMap[socket.id] = username;
  
      const clients = getAllConnectedClients(roomId);
      clients.forEach(({ socketId }) => {
        io.to(socketId).emit("joined", { clients, username, socketId: socket.id });
      });
    });
  
    // Handle code-change event
    socket.on("code-change", ({ roomId, code }) => {
      socket.to(roomId).emit("code-change", { roomId, code });
    });
  
    // Handle disconnect
    socket.on("disconnecting", () => {
      const rooms = [...socket.rooms];
      rooms.forEach((roomId) => {
        socket.in(roomId).emit("disconnected", {
          socketId: socket.id,
          username: userSocketMap[socket.id]
        });
      });
      delete userSocketMap[socket.id];
    });
  });
  



io.on('connection', (socket) => { 
      socket.on('join-room', ({ roomCode, username }) => { socket.join(roomCode);
        socket.to(roomCode).emit('user-joined', `${username} joined the chat`);
             });

      socket.on('group-message', ({ roomCode, sender, message }) => { // Broadcast message to others in the room 
      io.to(roomCode).emit('group-message', { sender, message, timestamp: new Date() });
     // Save message to MongoDB
     const GroupMessage = require('./model/GroupMessage');
     const newMessage = new GroupMessage({ room_code: roomCode, sender, message });
     newMessage.save();
  });
 });


  
// Middlewares
app.use(cors());
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/userAuthen', userAuthen);
app.use('/projectRoom', projectRoom);
app.use('/fileRoutes', fileRoom);
app.use('/groupRoutes', groupRoom);
app.post('/ask-ai', async (req, res) => {
  const { code, question } = req.body;

  if (!code || !question) {
    return res.status(400).json({ error: 'Code and question are required.' });
  }

  const prompt = `
    I am working on the following code:
    ${code}

    Here is my question about the code:
    ${question}

    Please explain the issue and suggest a possible fix in simple terms.
  `;

  try {
    const response = await axios.post(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        model: "mistralai/mistral-7b-instruct",
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.3,
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const answer = response.data.choices[0].message.content;
    res.json({ answer });

  } catch (error) {
    console.error('OpenRouter error:', error.response?.data || error.message);
    res.status(500).json({ error: 'Failed to fetch AI response' });
  }
});


// app.post('/ask-ai', async (req, res) => {
//   const { code, question } = req.body;

//   if (!code || !question) {
//     return res.status(400).json({ error: 'Code and question are required.' });
//   }

//   const prompt = `I am working on the following code:

// ${code}

// Here is my question about the code:
// ${question}

// Please explain the issue and suggest a possible fix in simple terms.`;

//   try {
//     const response = await openai.chat.completions.create({
//       model: 'gpt-3.5-turbo',
//       messages: [
//         {
//           role: 'user',
//           content: prompt,
//         },
//       ],
//       temperature: 0.3,
//     });

//     const answer = response.choices[0].message.content;
//     res.json({ answer });
//   } catch (error) {
//     console.error('OpenAI error:', error);
//     res.status(500).json({ error: 'Failed to fetch AI response' });
//   }
// });


// Error handling middleware (optional)
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

// Start server
server.listen(port, () => {
    console.log('Server is running on port 3000');
});
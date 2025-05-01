const io = require("socket.io")(server, {
  cors: {
    origin: "http://localhost:3000", // Update this to match your frontend's origin
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  socket.on("join", ({ roomId, username }) => {
    socket.join(roomId);
    io.to(roomId).emit("joined", { clients: [...io.sockets.adapter.rooms.get(roomId)], username, socketId: socket.id });
  });

  // Handle code-change event and broadcast to other users
  socket.on("code-change", ({ roomId, code }) => {
    socket.broadcast.to(roomId).emit("code-change", { code, roomId });
  });

  socket.on("disconnect", () => {
    io.to(roomId).emit("disconnected", { socketId: socket.id, username });
  });
});

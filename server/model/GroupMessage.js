const mongoose = require("mongoose");

const GroupMessageSchema = new mongoose.Schema({
     room_code: { type: String, required: true }, 
     sender: { type: String, required: true }, // sender's username or name
     message: { type: String, required: true }, 
     timestamp: { type: Date, default: Date.now }, 
});

module.exports = mongoose.model("GroupMessage", GroupMessageSchema);
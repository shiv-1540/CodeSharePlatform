const mongoose = require('mongoose');

const codeRoomSchema = new mongoose.Schema({
    roomID: { type: String, required: true, unique: true },
    project: { type: mongoose.Schema.Types.ObjectId, ref: 'ProjectRoom' },  // Corrected reference
    members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    code: { type: String, default: '' }
});

const CodeRoom = mongoose.model('CodeRoom', codeRoomSchema);  // Corrected model name
module.exports = CodeRoom;

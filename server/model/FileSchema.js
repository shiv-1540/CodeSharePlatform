const mongoose = require('mongoose');

const FileSchema = new mongoose.Schema({
  file_name: { type: String, required: true },
  file_type: { type: String, required: true },
  file_url: { type: String, required: true },
  room_code: { type: String,default: null  },
  upload_time: { type: Date, default: Date.now }
});

module.exports = mongoose.model('File', FileSchema);

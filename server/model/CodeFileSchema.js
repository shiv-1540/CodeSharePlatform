const mongoose = require("mongoose");

const CodeFileSchema = new mongoose.Schema({
  file_name: { type: String, required: true },
  file_url: { type: String, required: true },
  language: { type: String, required: true },
  room_code: { type: String, required: true },
  uploaded_by: { type: String }, // optional
  upload_time: { type: Date, default: Date.now },
});

module.exports = mongoose.model("CodeFile", CodeFileSchema);

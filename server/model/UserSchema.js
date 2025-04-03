const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
         type: String, 
         required: true 
        },
    username: { 
        type: String, 
        required: true, 
        unique: true 
    },
    email: { 
        type: String, 
        required: true,
        unique: true 
    },
    password:  { 
         type: String,
         required: true 
    },
    joinedRooms: [
        {    type: mongoose.Schema.Types.ObjectId,
             ref: 'ProjectRoom'
        }
        ],  // Reference to ProjectRoom
    createdRooms: [{ 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'ProjectRoom'
     }]  // Reference to ProjectRoom
});

const User = mongoose.model('User', userSchema);
module.exports = User;

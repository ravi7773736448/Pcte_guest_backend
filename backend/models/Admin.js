const mongoose = require('mongoose');

const AdminSchema = new mongoose.Schema({

  email: { 
    type: String, 
    required: true, 
    unique: true, 
    lowercase: true 
  },
  passwordHash: { 
    type: String, 
    required: true 
  },
  role: { 
    type: String, 
    enum: ["superadmin", "admin"], 
    default: "admin" 
  },
  lastLogin: { 
    type: Date 
  },
}, { timestamps: true });

module.exports = mongoose.model('Admin', AdminSchema);

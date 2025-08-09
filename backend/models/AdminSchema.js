const mongoose = require("mongoose");
const connectTOdb = require('../config/connect')

const userSchema = mongoose.Schema({
         email : {
             type: String,
             required: true,
             unique: true
         },
         password : {
            type: String,
    required: true
         }
});




const Admin = mongoose.model('Admin', userSchema);

module.exports = Admin;
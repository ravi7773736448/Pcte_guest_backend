const mongoose = require('mongoose');


const connectTOdb = async() => {
    try{
         await mongoose.connect('mongodb://127.0.0.1:27017/guestmanagementsystem')
         console.log("connected to MongoDB");
    }
    
    catch(err){
        console.log("MongoDB Error",err);
        
    }
    
}


module.exports = connectTOdb;

const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    fName : { type : String , require : true },
    lName : { type : String , require : true },
    displayName : { type : String , require : true },
    email : { type : String , require : true , unique : true },
    profilePicture : { type : String , default : null },
    password : { type : String , require : true },
    date : { type : Date , default : new Date()},
})

module.exports = mongoose.model('user' , userSchema)
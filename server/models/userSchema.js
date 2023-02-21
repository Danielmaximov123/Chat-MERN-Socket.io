const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    username : { type : String , require : true , trim : true },
    email : { type : String , require : true , unique : true },
    profilePicture : { type : String , default : null },
    password : { type : String , require : true },
    date : { type : Date , default : new Date()},
})

module.exports = mongoose.model('user' , userSchema)
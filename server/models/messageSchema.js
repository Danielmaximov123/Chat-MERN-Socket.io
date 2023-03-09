const mongoose = require('mongoose')

const messageSchema = new mongoose.Schema({
    chatId : {
        type : String
    },
    senderId : {
        type : String
    },
    text : {
        type : String
    },
    file : {
        filename : { type : String , default : null },
        url : { type : String , default : null },
        mimetype : { type : String , default : null }
    }
},{
    timestamps : true
})

module.exports = mongoose.model('message' , messageSchema)
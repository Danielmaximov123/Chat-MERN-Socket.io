const mongoose = require('mongoose')

const notificationSchema = new mongoose.Schema({
    senderId : {
        type : String
    },
    chatId : {
        type : String
    },
    date : {
        type : String
    }
})

module.exports = mongoose.model('notification' , notificationSchema)
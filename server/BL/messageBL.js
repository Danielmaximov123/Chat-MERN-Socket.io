const MessageModel = require('../models/messageSchema')
const firebase = require('../config/firebase-cloud-helper')

exports.addMessage = (data , file) => {
    return new Promise(async(resolve ,reject) => {
        try {
            const newMessage = new MessageModel({
                chatId : data.chatId,
                senderId : data.senderId,
                text : data.text,
            })

            if (file) {
                const { filename, url , type } = await firebase.uploadFileInChat(data.chatId, file, newMessage._id);
                newMessage.file.filename = filename; 
                newMessage.file.url = url;
                newMessage.file.type = type
              }
            newMessage.save((err) => {
                if(err) {
                    reject(err)
                } else {
                    resolve(newMessage)
                }
              })
        } catch (error) {
            resolve(error)
        }
    })
}

exports.getMessages = (chatId) => {
    return new Promise(async(resolve ,reject) => {
        try {
            const result = await MessageModel.find({chatId})
            resolve(result)
        } catch (error) {
            resolve(error)
        }
    })
}
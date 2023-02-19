const MessageModel = require('../models/messageSchema')

exports.addMessage = (data) => {
    return new Promise(async(resolve ,reject) => {
        console.log(data);
        const newMessage = new MessageModel(data)
        try {
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

// exports.addMessage = () => {
//     return new Promise(async(resolve ,reject) => {

//     })
// }
const ChatModel = require('../models/chatSchema')
const MessageModel = require('../models/messageSchema')

exports.createChat = (data) => {
    return new Promise(async(resolve , reject) => {
        const newChat = new ChatModel({
            members : [data.senderId , data.receiverId]
        })
        try {
            newChat.save((err) => {
                if(err) {
                    reject(err)
                } else {
                    resolve(newChat)
                }
              })
        } catch (error) {
            resolve(error)
        }
    })
}

exports.getAllChats = () => {
    return new Promise(async (resolve, reject) => {
        try {
            const chat = await ChatModel.find({});
            resolve(chat);
          } catch (error) {
            resolve(error);
          }
    });
}

exports.userChats = (userId) => {
    return new Promise(async (resolve, reject) => {
        try {
            const chat = await ChatModel.find({
              members: { $in: [userId] },
            });
            resolve(chat);
          } catch (error) {
            resolve(error);
          }
    });
}

exports.DeleteUserChats = (userId) => {
    return new Promise(async (resolve, reject) => {
        try {
            const chat = await ChatModel.find({
              members: { $in: [userId] },
            });
            
            await MessageModel.deleteMany({
                chatId: { $in: chat.map((c) => c._id) },
            });
            await ChatModel.deleteMany({
              _id: { $in: chat.map((c) => c._id) },
            });
            resolve('user deleted')
          } catch (error) {
            reject(error);
          }
    });
}


exports.findChat = (firstId , secondId) => {
    return new Promise(async (resolve , reject) => {
        try {
           const chat = await ChatModel.findOne({
            members : {$all : [firstId , secondId]}
           })
           resolve(chat)
        } catch (error) {
           resolve(error)
       }
   })
}

exports.findChatById = (chatId) => {
    return new Promise(async (resolve , reject) => {
        try {
          ChatModel.findById(chatId , (err ,data) => {
            if(err) {
                reject(err)
            } else {
                resolve(data)
              }
            })
        } catch (error) {
           resolve(error)
       }
   })
}
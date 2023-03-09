const NotificationModel = require('../models/notificationSchema')

exports.addNotification = (data) => {
    return new Promise(async(resolve ,reject) => {
        const newNotification = new NotificationModel(data)
        try {
            newNotification.save((err) => {
                if(err) {
                    reject(err)
                } else {
                    resolve(newNotification)
                }
              })
        } catch (error) {
            resolve(error)
        }
    })
}

exports.getNotification = (id) => {
    return new Promise(async(resolve ,reject) => {
        try {
            NotificationModel.findById(id , (err ,data) => {
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

exports.deleteNotification = (chatId) => {
    return new Promise((resolve, reject) => {
        try {
            NotificationModel.deleteMany(chatId , (err) => {
                if(err) {
                    reject(err)
                } else {
                    resolve('deleted')
                }
            })
        } catch (error) {
            
        }
    })
}
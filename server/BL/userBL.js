const userSchema = require('../models/userSchema')
const firebase = require('../config/firebase-cloud-helper')
const iconv = require('iconv-lite');
const chatBL = require('../BL/chatBL')

exports.getUser = (id) => {
  return new Promise((resolve , reject) => {
    try {
      userSchema.findById(id , (err ,data) => {
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

exports.getAllUser = () => {
    return new Promise(async(resolve , reject) => {
        try {
          userSchema.find({} , (err , data) => {
            if(err) {
                reject(err)
            } else {
                resolve(data)
            }
        })
          } catch (error) {
            resolve(error);
          }
    })
}

exports.deleteUser = (id) => {
  return new Promise(async (resolve , reject) => {
    try {
      await chatBL.DeleteUserChats(id)
      await this.deletePictureProfile(id)
      userSchema.findByIdAndRemove(id , (err) => {
          if(err) {
              reject(err)
          } else {
              resolve('deleted !')
            }
          })
        } catch (error) {
      resolve(error)
    }
  })
}

exports.updatePictureProfile = (file , id) => {
 return new Promise(async(resolve, reject) => {
   try {
     if(file) {
      let uploadFile = await firebase.uploadProfilePicture(file , id)
     data = { filename : iconv.decode(Buffer.from(file.originalname, 'binary'), 'utf-8') , url : uploadFile }
     userSchema.findByIdAndUpdate(id ,
      { profilePicture : data } , async (err) => {
        if(err) {
          reject(err)
        } else {
          let getUser = await this.getUser(id)
          resolve(getUser)
        }
      })
     } else {
      let getUser = await this.getUser(id)
          resolve(getUser)
     }
   } catch (error) {
     resolve(error)
   }
 })
}

exports.deletePictureProfile = (id) => {
 return new Promise(async(resolve, reject) => {
   try {
     await firebase.deleteFilesFromUserFolder(id)
    userSchema.findByIdAndUpdate(id ,
      { profilePicture : { filename : null , url : null } } , async (err) => {
        if(err) {
          reject(err)
        } else {
          let getUser = await this.getUser(id)
          resolve(getUser)
        }
      })
   } catch (error) {
     resolve(error)
   }
 })
}

exports.updateUser = (id , data) => {
  return new Promise(async(resolve, reject) => {
    try {
      userSchema.findByIdAndUpdate(id ,
       data , async (err) => {
         if(err) {
           reject(err)
         } else {
           let getUser = await this.getUser(id)
           resolve(getUser)
         }
       })
    } catch (error) {
      resolve(error)
    }
  })
 }

const userSchema = require('../models/userSchema')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const userBL = require('../BL/userBL')


exports.register = (data , file) => {
  return new Promise(async (resolve, reject) => {
    const { fName , lName , password, email } = data
    try {
      const emailExist = await userSchema.findOne({email})
      if (emailExist) {
        resolve({
          success: false,
          message: 'There is already a user with this email',
        })
      }
      if (password.length < 8 || password.length > 16) {
        resolve({
          success: false,
          message:
            'The length of the password should be between 8 and 16 characters',
        })
      }

      let passwordHash = await bcrypt.hash(password, 12)

      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        resolve({
          success: false,
          message: 'The email you entered is not in email format',
        })
      }
      const newUser = new userSchema({
        fName,
        lName,
        email,
        password: passwordHash,
      })

      newUser.save(async(err) => {
        if(err) {
            reject(err)
        } else {
          if(file) {
            await userBL.updatePictureProfile(file , newUser._id)
          }
          let getUser = await userBL.getUser(newUser._id)
            resolve({success : true , getUser})
        }
      });
    } catch (error) {
      resolve({message : error.message})
    }
  })
}

exports.login = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
        const { email , password } = data
    const user = await userSchema.findOne({email})
    if(!user) {
        resolve({
            success: false,
            message: 'No such user exists',
          })
    }
    const passwordCompare = await bcrypt.compare(password , user.password)
    if(!passwordCompare) {
        resolve({
            success: false,
            message: 'The password is incorrect',
          })
    }

    const token = jwt.sign({
        id: user._id,
        fName : user.fName,
        lName : user.lName,
        displayName : user.displayName,
        email : user.email,
        profilePicture : user.profilePicture,
        password : user.password
      } , 'SECRET_KEY' , { expiresIn : '1h' })

        resolve({success : true , token})
    } catch (error) {
      resolve({message : error.message})
    }
  })
}

exports.changePassword = (id , obj) => {
  return new Promise(async (resolve , reject) => {
    const user = await userSchema.findById(id)
    let password = obj.password
    let oldPass = await bcrypt.compare(obj.oldPassword , user.password)
    if(!oldPass) {
      resolve({success : false , message : 'The old password is wrong.'} )
    }
    const isSamePassword = await bcrypt.compare(password , user.password)
    if( isSamePassword ) {
        resolve({success : false , message : 'The new password should be different from old'} )
    }
    if (password.length < 8 || password.length > 16) {
      resolve({
        success: false,
        message:
          'The length of the password should be between 8 and 16 characters',
      })
    }
    else {
      let passwordHash = await bcrypt.hash(password, 12)
        user.password = passwordHash
        user.save((err) => {
            if (err) {
                reject(err)
            } else {
                resolve({success : true , message : 'The password has been successfully changed!'})
            }
        })
    }
})
}
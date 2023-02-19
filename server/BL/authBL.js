const authSchema = require('../models/authSchema')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')

exports.register = (data) => {
  return new Promise(async (resolve, reject) => {
    const { username, password, email } = data
    try {
      const emailExist = await authSchema.findOne({email})
      if (emailExist) {
        resolve({
          success: false,
          message: 'There is already a user with this email',
        })
      }
      const usernameExist = await authSchema.findOne({username})
      if (usernameExist) {
        resolve({
          success: false,
          message: 'There is already a user with this username',
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
      const newUser = new authSchema({
        username,
        email,
        password: passwordHash,
      })

      const token = jwt.sign({
        id: newUser._id,
        username : newUser.username,
        email : newUser.email
      } , 'SECRET_KEY' , { expiresIn : '1h' })

      newUser.save((err) => {
        if(err) {
            reject(err)
        } else {
            resolve({success : true , newUser})
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
    const user = await authSchema.findOne({email})
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
        username : user.username,
        email : user.email
      } , 'SECRET_KEY' , { expiresIn : '1h' })

        resolve({success : true , token})
    } catch (error) {
        reject({message : error.message})
    }
  })
}

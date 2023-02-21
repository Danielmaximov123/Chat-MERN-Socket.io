const userSchema = require('../models/userSchema')

exports.getUser = (id) => {
    return new Promise(async (resolve , reject) => {
        try {
            const user = await userSchema.findById(id);
            if (user) {
              const { password, ...otherDetails } = user._doc;
        
              resolve(otherDetails);
            } else {
                resolve("No such User");
            }
          } catch (error) {
            resolve(error);
          }
    })
}

exports.getAllUser = () => {
    return new Promise(async(resolve , reject) => {
        try {
            let users = await userSchema.find();
            users = users.map((user)=>{
              const {password, ...otherDetails} = user._doc
              return otherDetails
            })
            resolve(users);
          } catch (error) {
            resolve(error);
          }
    })
}
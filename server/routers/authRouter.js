const express = require('express')
const router = express.Router()
const authBL = require('../BL/authBL')
const firebase = require('../config/firebase-cloud-helper')

router.route('/register').post(firebase.upload.single('photo') ,async (req , res) => {
  let data = await authBL.register(JSON.parse(req.body.data) , req.file)
  res.send(data)
})

router.route('/login').post(async (req, res) => {
  let data = await authBL.login(req.body)
  res.send(data)
})

router.route('/change-password/:id').put(async (req , res) => {
  let id = req.params.id;
  let updatePassword = await authBL.changePassword(id , req.body)
  res.send(updatePassword)
})


module.exports = router

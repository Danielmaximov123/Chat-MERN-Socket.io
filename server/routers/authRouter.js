const express = require('express')
const router = express.Router()
const authBL = require('../BL/authBL')
const userBL = require('../BL/userBL')
const firebase = require('../config/firebase-cloud-helper')

// router.route('/register').post(async (req, res) => {
//   let data = await authBL.register(req.body)
//   res.send(data)
// })

router.route('/register').post(firebase.upload.single('photo') ,async (req , res) => {
  let data = await authBL.register(JSON.parse(req.body.data) , req.file)
  res.send(data)
})

router.route('/login').post(async (req, res) => {
  let data = await authBL.login(req.body)
  res.send(data)
})

module.exports = router

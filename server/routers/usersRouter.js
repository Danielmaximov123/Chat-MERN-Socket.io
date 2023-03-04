const express = require('express')
const router = express.Router()
const userBL = require('../BL/userBL')
const firebase = require('../config/firebase-cloud-helper')

router.route('/').get(async (req, res) => {
  let data = await userBL.getAllUser()
  res.send(data)
})

router.route('/:id').get(async (req, res) => {
  let data = await userBL.getUser(req.params.id)
  res.send(data)
})

router.route('/:id').put(async (req, res) => {
  let data = await userBL.updateUser(req.params.id , req.body)
  res.send(data)
})

router.route('/:id').delete(async (req, res) => {
  let data = await userBL.deleteUser(req.params.id)
  res.send(data)
})

router.route('/profile-photo/:id').put(firebase.upload.single('photo') ,async (req , res) => {
  let data = await userBL.updatePictureProfile(req.file , req.params.id)
  res.send(data)
})

router.route('/profile-photo/:id').delete(async (req , res) => {
  let data = await userBL.deletePictureProfile(req.params.id)
  res.send(data)
})


module.exports = router

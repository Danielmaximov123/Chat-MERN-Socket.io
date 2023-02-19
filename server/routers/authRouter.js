const express = require('express')
const router = express.Router()
const authBL = require('../BL/authBL')

router.route('/register').post(async (req, res) => {
  let data = await authBL.register(req.body)
  res.send(data)
})

router.route('/login').post(async (req, res) => {
  let data = await authBL.login(req.body)
  res.send(data)
})

module.exports = router

const express = require('express')
const router = express.Router()
const userBL = require('../BL/userBL')

router.route('/').get(async (req, res) => {
    let data = await userBL.getAllUser()
    res.send(data)
  })

router.route('/:id').get(async (req, res) => {
  let data = await userBL.getUser(req.params.id)
  res.send(data)
})

module.exports = router

const express = require('express')
const router = express.Router()
const chatBL = require('../BL/chatBL')

router.route('/').get(async (req , res) => {
    let data = await chatBL.getAllChats(req.body)
    res.send(data)
})

router.route('/').post(async (req , res) => {
    let data = await chatBL.createChat(req.body)
    res.send(data)
})

router.route('/:userId').get(async (req , res) => {
    let data = await chatBL.userChats(req.params.userId)
    res.send(data)
})

router.route('/find/:firstId/:secondId').get(async (req , res) => {
    let firstId = req.params.firstId
    let secondId = req.params.secondId
    let data = await chatBL.findChat(firstId , secondId)
    res.send(data)
})

module.exports = router
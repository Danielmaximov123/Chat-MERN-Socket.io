const express = require('express')
const router = express.Router()
const messageBL = require('../BL/messageBL')

router.route('/').post(async (req , res) => {
    let data = await messageBL.addMessage(req.body)
    res.send(data)
})

router.route('/:chatId').get(async (req , res) => {
    let data = await messageBL.getMessages(req.params.chatId)
    res.send(data)
})


module.exports = router
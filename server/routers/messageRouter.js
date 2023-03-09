const express = require('express')
const router = express.Router()
const messageBL = require('../BL/messageBL')
const firebase = require('../config/firebase-cloud-helper')

router.route('/').post(firebase.upload.single('file') , async (req , res) => {
    let data = await messageBL.addMessage(JSON.parse(req.body.message) , req.file)
    res.send(data)
})


router.route('/:chatId').get(async (req , res) => {
    let data = await messageBL.getMessages(req.params.chatId)
    res.send(data)
})


module.exports = router
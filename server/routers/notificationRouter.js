const express = require('express')
const router = express.Router()
const notificationBL = require('../BL/notificationBL')

router.route('/').post(async (req , res) => {
    let data = await notificationBL.addNotification(req.body)
    res.send(data)
})

router.route('/:id').get(async (req , res) => {
    let data = await notificationBL.getNotification(req.params.id)
    res.send(data)
})

router.route('/').delete(async (req , res) => {
    let data = await notificationBL.deleteNotification(req.body)
    res.send(data)
})

module.exports = router
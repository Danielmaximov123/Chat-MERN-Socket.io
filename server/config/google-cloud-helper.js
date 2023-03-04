const { Storage } = require('@google-cloud/storage')
const Multer = require('multer')
const fs = require("fs");

exports.multer = Multer({
    storage : Multer.memoryStorage(),
})

const storage = new Storage({
    projectId : process.env.GOOGLE_PROJECT_ID,
    keyFilename : './mykey.json'
})

const bucket = storage.bucket(process.env.GOOGLE_BUCKET)
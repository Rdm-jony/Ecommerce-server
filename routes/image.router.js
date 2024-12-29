const express = require('express');
const multer = require('multer')
const path = require('path')
const { imageUpload } = require('../Controller/image.controller');
const router = express.Router()

const UPLOADS_FOLDER = path.join(__dirname, '../uploads');
const storage = multer.memoryStorage();
const upload = multer({
    storage: storage, limits: {
        fileSize: 1000000
    },
})
router.post('/', upload.fields([{ name: 'galleryImage[]', maxCount: 5 }, { name: 'singleImage', maxCount: 1 }, { name: 'editedImage', maxCount: 1 }]), imageUpload)
module.exports = router
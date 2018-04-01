var express = require('express');
var multer = require('multer');
var path = require('path');
var router = express.Router();
var controller = require('./upload.controller');

var upload = multer({
    dest: 'upload/',
    storage: multer.diskStorage({
        filename: function(req, file, cb) {
            cb(null, file.originalname);
        }
    })
});

router.post('/', upload.any(), controller.upload);
module.exports = router;
var express = require('express');
var multer = require('multer');
var router = express.Router();
var controller = require('./user.controller');

router.get('/details', controller.fetchUser);
router.post('/change-details', controller.changeDetails);
router.post('/change-password', controller.changePassword);
router.post('/change-profile-picture', controller.changeProfilePicture);
module.exports = router;
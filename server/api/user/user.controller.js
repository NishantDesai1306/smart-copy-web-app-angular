var User = require('./user.model');
var authController = require('../../auth/auth.controller');

exports.fetchUser = function(req, res) {
    res.json({
        status: true,
        data: {
            _id: req.user._id,
            username: req.user.username,
            email: req.user.email,
            profilePictureUrl: req.user.profilePicture.path
        }
    });
};

exports.changeDetails = function(req, res) {
    User.changeDetails(req.user._id, req.body)
        .then(function(newUser) {
            res.json({
                status: true,
                data: {
                    _id: newUser._id,
                    username: newUser.username,
                    email: newUser.email,
                    profilePictureUrl: newUser.profilePictureUrl
                }
            });
        }, function(err) {
            res.json({
                status: false,
                reason: err.toString()
            });
        });
};

exports.changePassword = function(req, res) {
    User.changePassword(req.user, req.body.oldPassword, req.body.newPassword)
        .then(function() {
            res.json({
                status: true
            });
        }, function(err) {
            res.json({
                status: false,
                reason: err.toString()
            });
        });
};

exports.changeProfilePicture = function(req, res) {
    User.changeProfilePicture(req.user, req.body.profilePicture)
        .then(function(newUser) {
            res.json({
                status: true,
                data: {
                    _id: newUser._id,
                    username: newUser.username,
                    email: newUser.email,
                    profilePictureUrl: newUser.profilePictureUrl
                }
            });
        }, function(err) {
            res.json({
                status: false,
                reason: err.toString()
            });
        });
};
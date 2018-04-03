var passport = require('passport');
var Q = require('q');

var salt = require('../config').salt;
var bcrypt = require('bcrypt-nodejs');
var User = require('../api/user/user.model');
var Token = require('./token/token.model');

exports.login = function(req, res) {
    passport.authenticate('local', function(err, user, info) {
        var promise = Q.when();

        if (!user) {
            return res.json({
                status: false,
                reason: info
            });
        }

        Q.when(user)
        .then(function (user) {
            var userDefer = Q.defer();

            req.login(user, function(err) {
                if (err) {
                    return userDefer.reject(err);
                }

                return userDefer.resolve(user);
            });
        })
        .then(function() {
            if (req.body.rememberMe) {
                return Token.issueToken(req.user._id);
            }
            else {
                return Q.when();
            }
        })
        .then(function(tokenObj) {

            if (tokenObj) {
                res.cookie('remember_me', tokenObj.token, { path: '/', httpOnly: true, maxAge: 604800000 });
            }

            res.json({
                status: true,
                data: {
                    _id: user._id,
                    username: user.username,
                    email: user.email,
                    profilePictureUrl: user.profilePicture.path
                }
            });
        })
        .catch(function(err) {
            res.send(err);
        });
    })(req, res);
};

exports.successRegister = function(req, res) {
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

exports.logout = function(req, res) {
    Token.clearUserTokens(req.user._id.toString());

    req.logout();
    res.clearCookie('remember_me');
    res.json({
        status: true
    });
};
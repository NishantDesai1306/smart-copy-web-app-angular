var passport = require('passport');
var Q = require('q');
var request = require('request');
var FacebookVerification = require('@coolgk/facebook-sign-in');
var bcrypt = require('bcrypt-nodejs');

var config = require('../config');
var User = require('../api/user/user.model');
var Token = require('./token/token.model');
var GoogleVerifier = require('./google.verify');

var salt = config.salt;
var FacebookVerifier = new FacebookVerification.FacebookSignIn({
    clientId: config.facebookAppId,
    secret: config.facebookAppSecret
});

exports.socialLogin = function(req, res, next) {
    var validateUserToken = function(token, source) {
        var defer = Q.defer();
        var promise = null;

        if(source === 'facebook') {
            promise = FacebookVerifier.verify(token);
        }
        else if(source === 'google') {
            promise = GoogleVerifier.verify(token, req.body.email);
        }
        else {
            return Q.reject(new Error('invalid source provided'));
        }

        promise
        .then(function() {
            return defer.resolve();
        })
        .catch(function (err) {
            return defer.reject(err);
        });

        return defer.promise;
    };

    validateUserToken(req.body.token, req.body.source)
    .then(function() {
        var userDefer = Q.defer();

        User.findOne({ email: req.body.email })
        .populate('profilePicture')
        .exec(function (err, user) {
            if(err) {
                console.log(err);
                userDefer.reject(err);
            }
            
            if (!user) {
                return User.createUser(req.body.email, req.body.username, req.body.password, req.body.imageUrl, req.body.source)
                    .then(function (newUser) {
                        userDefer.resolve(newUser);
                    })
                    .catch(function (err) {
                        userDefer.reject(err);
                    });
            }

            return userDefer.resolve(user);
        });

        return userDefer.promise;
    })
    .then(function (user) {
        var loginDefer = Q.defer();

        req.login(user, function(err) {
            if (err) {
                return loginDefer.reject(err);
            }

            return loginDefer.resolve(user);
        });

        return loginDefer.promise;
    })
    .then(function (user) {
        console.log('user', user);

        return res.json({
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
        console.log(err);
        return res.json({
            status: false,
            reason: err.message || err.toString()
        });
    });
};

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
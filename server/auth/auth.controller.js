var passport = require('passport');
var Q = require('q');
var request = require('request');
var FacebookVerification = require('@coolgk/facebook-sign-in');
var bcrypt = require('bcrypt-nodejs');

var config = require('../config');
var User = require('../api/user/user.model');
var RememberMeToken = require('./token/rememberMeToken.model');
var AuthToken = require('./token/authToken.model');
var GoogleVerifier = require('./google.verify');

var salt = config.salt;
var FacebookVerifier = new FacebookVerification.FacebookSignIn({
    clientId: config.facebookAppId,
    secret: config.facebookAppSecret
});

exports.socialLogin = function(req, res, next) {

    Q.when()
    .then(function() {
        var defer = Q.defer();
        var promise = null;
    
        if(req.body.source === 'facebook') {
            promise = FacebookVerifier.verify(req.body.token);
        }
        else if(req.body.source === 'google') {
            promise = GoogleVerifier.verify(req.body.token, req.body.email);
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
    })
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
        return res.json({
            status: true,
            data: {
                _id: user._id,
                username: user.username,
                email: user.email,
                social: user.socialLogin,
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
        var appToken = null;

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
        .then(function (user) {
            var defer = Q.defer();
        
            if (req.appType === 'mobile') {
                AuthToken.issueToken(req.user._id)
                .then(function (authTokenObj) {
                    appToken = authTokenObj.token;
                    return defer.resolve();
                })
                .catch(function(err) {
                    return defer.reject(err);
                });
            }
            else {
                defer.resolve();
            }

            return defer.promise;
        })
        .then(function() {
            if (req.body.rememberMe) {
                return RememberMeToken.issueToken(req.user._id);
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
                    profilePictureUrl: user.profilePicture.path,
                    token: appToken
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
    RememberMeToken.clearUserTokens(req.user._id.toString());

    req.logout();
    res.clearCookie('remember_me');
    res.json({
        status: true
    });
};

exports.validateEmail = function(req, res, next) {
    var email = req.query.email;

    if (!email) {
        return res.json({
            status: false,
            reason: 'invalid email provided'
        });
    }

    User.validateEmail(email, req.user && req.user._id)
    .then(function(isValid) {
        return res.json({
            status: true,
            data: isValid
        });
    })
    .catch(function (err) {
        console.log(err);
        return res.json({
            status: false,
            reason: err.message || err.toString()
        });
    });
};


exports.validateUsername = function(req, res, next) {
    var username = req.query.username;

    if (!username) {
        return res.json({
            status: false,
            reason: 'invalid username provided'
        });
    }

    User.validateUsername(username, req.user && req.user._id)
    .then(function(isValid) {
        return res.json({
            status: true,
            data: isValid
        });
    })
    .catch(function (err) {
        console.log(err);
        return res.json({
            status: false,
            reason: err.message || err.toString()
        });
    });
};

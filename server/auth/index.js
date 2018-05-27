var express = require('express');
var router = express.Router();
var passport = require('passport');
var passportConfig = require('./passport-config');
var controller = require('./auth.controller');
var AuthToken = require('./token/authToken.model');

passportConfig.setupPassport(passport);

var authTokenVerificationMiddleware = function (strict) {

    return function (req, res, next) {
        var token = req.headers['x-auth-token'];
         
        if (!token) {
            return res.status(401).send({ message: 'No token provided.' });
        }
    
        AuthToken.consumeToken(token)
        .then(function (user) {
            req.user = user;
            next();
        })
        .catch(function (err) {
            if (strict) {
                return next(err);
            }
            else {
                next();
            }
        });
    }
}

var isAuthenticated = function(strict) {
    return function (req, res, next) {
        if (req.appType === 'mobile') {
            var middleware = authTokenVerificationMiddleware(strict);
            middleware(req, res, next);
        } 
        else if(req.isAuthenticated()) {
            next();
        }
        else {
            next(new Error('Unauthorized'));
        }
    };
};
exports.isAuthenticated = isAuthenticated;

router.get('/validate-email', isAuthenticated(false), controller.validateEmail);
router.get('/validate-username', isAuthenticated(false), controller.validateUsername);

router.post('/login', controller.login);
router.post('/social-login', controller.socialLogin);
router.post('/register', passport.authenticate('local-signup'), controller.successRegister);
router.post('/logout', isAuthenticated(true), controller.logout);


exports.router = router;
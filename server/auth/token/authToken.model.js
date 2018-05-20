var mongoose = require('mongoose');
var moment = require('moment');
var Schema = mongoose.Schema;
var Q = require('q');
var bcrypt = require('bcrypt-nodejs');
var _ = require('lodash');
var randomString = require('randomstring');
var TokenModel = require('./token.model');

var authTokenSchema = new Schema({
    lastUsed: {
        type: Date
    },
    lifeTimeHours: {
        type: Number,
        default: 24
    }
});

authTokenSchema.pre('save', function(next) {
    this.lastUsed = new Date();
    next();
});

authTokenSchema.methods = {
    isExpired: function() {
        var tokenObj = this;

        var lastUsedMoment = moment(tokenObj.lastUsed);
        var expiresMoment = lastUsedMoment.add(tokenObj.lifeTimeHours, 'hours');

        return expiresMoment.isAfter(lastUsedMoment);
    }
}

authTokenSchema.statics = {
    consumeToken: function(token) {
        var consumeTokenDefer = Q.defer();

        this
        .findOne({token: token})
        .populate('user')
        .exec(function(err, tokenObj) {
            if(err) {
                return consumeTokenDefer.reject(err);
            }

            if (!tokenObj) {
                err = new Error('token ' + token + ' is invalid');
                return consumeTokenDefer.reject(err);                
            }

            if (tokenObj.isExpired()) {
                tokenObj.remove(function() {
                    err = new Error('token expired');
                    consumeTokenDefer.reject(err);
                });
            }
            else {
                tokenObj.save(function(err) {
                    if (err) {
                        return consumeTokenDefer.reject(err);
                    }

                    consumeTokenDefer.resolve(tokenObj.user);
                });
            }
        });

        return consumeTokenDefer.promise;
    },
    issueToken: function(userId) {
        var issueTokenDefer = Q.defer();
        var model = this;
        this.findOne({user: userId}, function(err, tokenObj) {
            if(err) {
                return issueTokenDefer.reject(err);
            }

            var newToken = randomString.generate();
            if(tokenObj) {
                tokenObj.token = newToken;
            }
            else {
                tokenObj = new model({
                    token: newToken,
                    user: userId
                });
            }

            tokenObj.save(function(err) {
                if(err) {
                    return issueTokenDefer.reject(err);
                }
                return issueTokenDefer.resolve(tokenObj);
            });
        });

        return issueTokenDefer.promise;
    },
    clearUserTokens: function(userId) {        
        this.remove({
            user: userId
        }, function(err) {
            if(err) {
                console.log(err);
            }
        });
    }
};

var AuthToken = TokenModel.discriminator('AuthToken', authTokenSchema);

module.exports = AuthToken;

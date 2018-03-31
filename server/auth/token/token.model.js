var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Q = require('q');
var bcrypt = require('bcrypt-nodejs');
var _ = require('lodash');
var randomString = require('randomstring');

var tokenSchema = new Schema({
    token: {
        type: String,
        required: true
    },
    user: {
        type: Schema.Types.ObjectId, 
        ref: 'User'
    }
});

tokenSchema.statics = {
    consumeToken: function(token) {
        var consumeTokenDefer = Q.defer();

        this.findOne({token: token}, function(err, tokenObj) {
            if(err) {
                return consumeTokenDefer.reject(err);
            }

            if (!tokenObj) {
                return consumeTokenDefer.resolve(null);
            }

            consumeTokenDefer.resolve(tokenObj.user);
            tokenObj.remove();
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

var Token = mongoose.model('Token', tokenSchema);

module.exports = Token;

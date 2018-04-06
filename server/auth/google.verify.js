var Q = require('q');
var request = require('request');

var config = require('../config');

exports.verify = function (token, email) {
    var defer = Q.defer();

    request('https://www.googleapis.com/oauth2/v1/tokeninfo?access_token='+token, function(err, res, body) {
        if (err) {
            return defer.reject(err);
        }

        body = JSON.parse(body);
        if (body.audience === config.googleAppId && body.email === email) {
            return defer.resolve();
        }
        else {
            return defer.reject(new Error('invalid token provided'));
        }
    });

    return defer.promise;
}
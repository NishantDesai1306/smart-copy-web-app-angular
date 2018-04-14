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
        // console.log(JSON.stringify(body.audience));
        // console.log(JSON.stringify(config.googleAppId));
        // console.log(body.audience === config.googleAppId);
        // console.log(JSON.stringify(body.email));
        // console.log(JSON.stringify(email));
        // console.log(body.email === email);
        if (body.audience === config.googleAppId && body.email === email) {
            return defer.resolve();
        }
        else {
            return defer.reject(new Error('invalid token provided'));
        }
    });

    return defer.promise;
}
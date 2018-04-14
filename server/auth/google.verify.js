var Q = require('q');
var request = require('request');

var config = require('../config');

exports.verify = function (token, email) {
    var defer = Q.defer();

    console.log('making request');
    request('https://www.googleapis.com/oauth2/v1/tokeninfo?access_token='+token, function(err, res, body) {
        
        if (err) {
            console.log('geot error', err);
            return defer.reject(err);
        }

        body = JSON.parse(body);
        console.log('@'+body.audience+'@', '@'+config.googleAppId+'@', '@'+body.email+'@', '@'+email+'@');
        if (body.audience === config.googleAppId && body.email === email) {
            return defer.resolve();
        }
        else {
            return defer.reject(new Error('invalid token provided'));
        }
    });

    return defer.promise;
}
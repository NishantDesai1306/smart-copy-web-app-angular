var path = require('path');
var Q = require('q');
var fs = require('fs');
var mv = require('mv');
var Upload = require('./upload.model');

exports.upload = function (req, res) {
    var tmpPath = req.files[0].path;
    var newFileName = Math.random().toString(36).substring(7)+path.extname(tmpPath);
    var targetPath = path.resolve(process.env.UPLOAD_PATH, newFileName);
    var defer = Q.defer();
    
    mv(tmpPath, targetPath, function (err) {
        if (err) {
            return nextIteration.reject(err);
        }
        
        targetPath = targetPath.substring(targetPath.indexOf('upload'));
        Upload.createUpload(targetPath).then(function(upload) {
            defer.resolve(upload);
        }, function(err) {
            defer.reject(err);
        });
    });

    defer.promise.then(function (upload) {
        res.json({
            status: true,
            data: upload._id
        });
    }, function(err) {
        console.log(err);
        res.json({
            status: false,
            reason: err.toString()
        });
    });
};
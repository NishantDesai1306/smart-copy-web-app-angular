var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Q = require('q');
var bcrypt = require('bcrypt-nodejs');
var _ = require('lodash');
var fs = require('fs');
var path = require('path');

var uploadSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    size: {
        type: Number,
        required: true
    },
    path: {
        type: String,
        required: true
    }
});

uploadSchema.statics = {
    getUploadById: function(uploadId) {
        var uploadDefer = Q.defer();

        this.findById(uploadId, function(err, upload) {
            if(err) {
                return uploadDefer.reject(err);
            }
            if(!upload) {
                return uploadDefer.reject(new Error('Invalid upload-id '+uploadId+' passed'));
            }

            return uploadDefer.resolve(upload);
        });

        return uploadDefer.promise;
    },
    createUpload: function(filepath) {
        var createUploadDefer = Q.defer();
        
        var newUpload = new this({
            name: path.basename(filepath),
            size: fs.statSync(filepath).size,
            path: filepath
        });

        newUpload.save(function(err) {
            if(err) {
                return createUploadDefer.reject(err);
            }
            return createUploadDefer.resolve(newUpload);
        });

        return createUploadDefer.promise;
    },
    deleteUpload: function(uploadId) {
        var deleteUploadDefer = Q.defer();

        this.getUploadById(uploadId)
        .then(function(upload) {
            fs.unlink(upload.path, function(err) {
                if(err) {
                    return deleteUploadDefer.reject(err);
                }

                upload.remove(function(err) {
                    if(err) {
                        return deleteUploadDefer.reject(err);
                    }
                    return deleteUploadDefer.resolve();
                });
            });
        }, function(err) {
            deleteUploadDefer.reject(err);
        });

        return deleteUploadDefer.promise;
    }
};

var Upload = mongoose.model('Upload', uploadSchema);

module.exports = Upload;

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Q = require('q');
var bcrypt = require('bcrypt-nodejs');
var _ = require('lodash');
var Upload = require('../upload/upload.model');
// create a schema
var userSchema = new Schema({
    username: String,
    email: {
        type: String,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: Date,
    profilePicture: {
        type: Schema.Types.ObjectId,
        ref: 'Upload'
    }
});
var DEFAULT_PROFILE_PICTURE = {
    _id: null,
    path: null
};

userSchema.statics = {
    getUserById: function(userId, fields) {
        var userDefer = Q.defer();

        this
            .findById(userId)
            .select(fields || '')
            .populate('profilePicture')
            .exec(function(err, user) {
                if (err) {
                    return userDefer.reject(err);
                }
                if (!user) {
                    return userDefer.reject(new Error('Invalid user-id ' + userId + ' passed'));
                }

                return userDefer.resolve(user);
            });

        return userDefer.promise;
    },
    isUserUnique: function(email, username, user) {
        var userDefer = Q.defer();
        var criteria = {
            $or: [
                { username: username },
                { email: email }
            ]
        };

        if (user) {
            criteria._id = {
                $ne: user._id ? user._id.toString() : user.toString()
            };
        }

        this.findOne(criteria, function(err, user) {
            if (err) {
                return userDefer.reject(err);
            }
            if (user) {
                var message = user.username === username ? 'Username' : 'Email';
                message += ' already exisits';

                return userDefer.reject(new Error(message));
            }

            return userDefer.resolve();
        });

        return userDefer.promise;
    },
    createUser: function(email, username, password) {
        var createUserDefer = Q.defer();
        var schema = this;

        this.isUserUnique(email, username)
            .then(function() {
                var profilePictureDefer = Q.defer();

                if (DEFAULT_PROFILE_PICTURE._id) {
                    return profilePictureDefer.resolve(DEFAULT_PROFILE_PICTURE);
                }

                Upload.findOne({ name: 'dummy_user.png' }, function(err, upload) {
                    if (err) {
                        return profilePictureDefer.reject(err);
                    }

                    DEFAULT_PROFILE_PICTURE._id = upload._id.toString();
                    DEFAULT_PROFILE_PICTURE.path = upload.path;
                    return profilePictureDefer.resolve(DEFAULT_PROFILE_PICTURE);
                });

                return profilePictureDefer.promise;
            })
            .then(function(dummyProfilePciture) {

                password = bcrypt.hashSync(password);
                var userModel = new schema({
                    email: email,
                    username: username,
                    password: password,
                    profilePicture: dummyProfilePciture._id
                });

                userModel.save(function(err) {
                    if (err) {
                        return createUserDefer.reject(err);
                    }

                    //passport's serialize-deserialize is called after successRegister of auth.controller 
                    //so profilePicture needs to be set here
                    createUserDefer.resolve({
                        _id: userModel._id,
                        email: userModel.email,
                        username: userModel.username,
                        profilePicture: dummyProfilePciture
                    });
                });
            }, function(err) {
                createUserDefer.reject(err);
            });

        return createUserDefer.promise;
    },
    changeDetails: function(userId, newDetails) {
        var self = this;
        var defer = Q.defer();

        this.isUserUnique(newDetails.email, newDetails.username, userId)
            .then(function() {
                return self.getUserById(userId);
            })
            .then(function(user) {
                var userDefer = Q.defer();

                user.email = newDetails.email;
                user.username = newDetails.username;
                user.save(function(err) {
                    if (err) {
                        userDefer.reject(err);
                        return defer.reject(err);
                    }
                    userDefer.resolve(user);
                });

                return userDefer.promise;
            })
            .then(function(user) {
                user.getUpload().then(function(upload) {
                    return defer.resolve({
                        _id: user._id,
                        username: user.username,
                        email: user.email,
                        profilePictureUrl: upload.path
                    });
                });
            })
            .catch(function(err) {
                defer.reject(err);
            });

        return defer.promise;
    },
    changePassword: function(user, oldPassword, newPassword) {
        var self = this;
        var defer = Q.defer();

        this.getUserById(user._id || user)
            .then(function(user) {
                var oldPasswordValidation = Q.defer();

                if (bcrypt.compareSync(oldPassword, user.password)) {
                    oldPasswordValidation.resolve(user);
                } else {
                    oldPasswordValidation.reject(new Error('Old Password is invalid'));
                }

                return oldPasswordValidation.promise;
            })
            .then(function(user) {
                var newPasswordHash = bcrypt.hashSync(newPassword);
                user.password = newPasswordHash;
                user.save(function(err) {
                    if (err) {
                        return defer.reject(err);
                    }
                    return defer.resolve();
                });
            })
            .catch(function(err) {
                defer.reject(err);
            });

        return defer.promise;
    },
    changeProfilePicture: function(userId, uploadId) {
        var changeProfilePictureDefer = Q.defer();
        var chain = Q.when();

        chain
            .then(function() {
                var userDefer = Q.defer();

                User.findOne({ _id: userId }, function(err, user) {
                    if (err) {
                        userDefer.reject(err);
                        return changeProfilePictureDefer.reject(err);
                    }

                    user.profilePicture = uploadId;
                    user.save(function(err) {
                        if (err) {
                            userDefer.reject(err);
                            return changeProfilePictureDefer.reject(err);
                        }
                        userDefer.resolve(user);
                    });
                });

                return userDefer.promise;
            })
            .then(function(user) {
                user.getUpload().then(function(upload) {
                    return changeProfilePictureDefer.resolve({
                        _id: user._id,
                        username: user.username,
                        email: user.email,
                        profilePictureUrl: upload.path
                    });
                });
            });

        return changeProfilePictureDefer.promise;
    }
};

userSchema.methods = {
    getUpload: function() {
        var uploadDefer = Q.defer();

        Upload.findById(this.profilePicture, function(err, upload) {
            if (err) {
                return uploadDefer.reject(err);
            }

            return uploadDefer.resolve(upload);
        });

        return uploadDefer.promise;
    }
};

// the schema is useless so far we need to create a model using it
var User = mongoose.model('User', userSchema);

// make this available to our users in our Node applications
module.exports = User;
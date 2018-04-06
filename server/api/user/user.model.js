var mongoose = require('mongoose');
var request = require('request');
var path = require('path');
var fs = require('fs');
var Q = require('q');
var bcrypt = require('bcrypt-nodejs');
var _ = require('lodash');

var Schema = mongoose.Schema;
var Upload = require('../upload/upload.model');
// create a schema
var userSchema = new Schema({
    username: String,
    email: {
        type: String,
        unique: true
    },
    password: {
        type: String
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    socialLogin: String,
    updatedAt: Date,
    profilePicture: {
        type: Schema.Types.ObjectId,
        ref: 'Upload'
    }
});

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
    createUser: function(email, username, password, imageUrl, socialLogin) {
        var createUserDefer = Q.defer();
        var schema = this;

        this.isUserUnique(email, username)
            .then(function() {
                var userDefer = Q.defer();
                var userModel = new schema({
                    email: email,
                    username: username,
                    password: password ? bcrypt.hashSync(password) : '',
                    socialLogin: socialLogin || null
                });

                userModel.save(function(err) {
                    if (err) {
                        return userDefer.reject(err);
                    }

                    return userDefer.resolve(userModel);
                });

                return userDefer.promise;
            })
            .then(function (user) {
                var profilePictureDefer = Q.defer();
                
                // if imageUrl is provided then download image 
                if (imageUrl) {
                    var profilePicPath = './upload/' + user._id.toString() + '.png';

                    request({uri: imageUrl})
                        .pipe(fs.createWriteStream(path.resolve(profilePicPath)))
                        .on('close', function() {

                            Upload.createUpload('upload/' + user._id.toString()+'.png')
                            .then(function(profilePictureUpload) {

                                user.profilePicture = profilePictureUpload._id;
                                user.save(function (err) {
                                    if (err) {
                                        return profilePictureDefer.reject(err);
                                    }

                                    return profilePictureDefer.resolve(user); 
                                });
                            })
                            .catch(function (err) {
                                return profilePictureDefer.reject(err);
                            });
                        });
                }
                else {
                    // find default profile picture
                    Upload.findOne({ name: 'dummy_user.png' }, function(err, upload) {
                        if (err) {
                            return profilePictureDefer.reject(err);
                        }
    
                        user.profilePicture = upload._id.toString();
                        return user.save(function (err) {
                            if (err) {
                                return profilePictureDefer.reject(err);
                            }
                            
                            return profilePictureDefer.resolve(user); 
                        });
                    });
                }

                return profilePictureDefer.promise;
            })
            .then(function (user) {
                user.populate('profilePicture', function(err) {
                    if (err) {
                        return createUserDefer.reject(err);
                    }

                    return createUserDefer.resolve(user.toJSON());
                });
            })
            .catch(function(err) {
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
                
                if (oldPassword){   
                    if (bcrypt.compareSync(oldPassword, user.password)) {
                        oldPasswordValidation.resolve(user);
                    } else {
                        oldPasswordValidation.reject(new Error('Old Password is invalid'));
                    }
                }
                else if(user.socialLogin) {
                    oldPasswordValidation.resolve(user);
                }
                else {
                    oldPasswordValidation.reject(new Error('old password cannot be empty'));
                }

                return oldPasswordValidation.promise;
            })
            .then(function(user) {
                var newPasswordHash = bcrypt.hashSync(newPassword);
                user.password = newPasswordHash;
                user.socialLogin = null;
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
    },
    validateEmail: function(email, excludeUser) {
        var defer = Q.defer();
        var model = this;
        var criteria = {
            email: email
        };

        if (excludeUser) {
            criteria._id = {
                $ne: excludeUser
            };
        }

        if (!email) {
            return Q.reject(new Error('invalid email provided'));
        }

        model.findOne(criteria, function(err, user) {
            if (err) {
                return defer.reject(err);
            }

            return defer.resolve(!user);
        });

        return defer.promise;
    },
    validateUsername: function(username, excludeUser) {
        var defer = Q.defer();
        var model = this;
        var criteria = {
            username: username
        };

        if (!username) {
            return Q.reject(new Error('invalid username provided'));
        }

        if (excludeUser) {
            criteria._id = {
                $ne: excludeUser
            };
        }

        model.findOne(criteria, function(err, user) {
            if (err) {
                return defer.reject(err);
            }

            return defer.resolve(!user);
        });

        return defer.promise;
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
var _ = require('lodash');
var Q = require('q');
var mongoose = require('mongoose');

var CopiedItemSchema = new mongoose.Schema({
    _id: {
        type: mongoose.Schema.Types.ObjectId,
        required: false
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    value: {
        type: String,
        required: true
    },
    createdAt: Number,
    updatedAt: Number,
    isDeleted: {
        type: Boolean,
        default: false
    }
});

CopiedItemSchema.statics = {
    getCopiedItems: function (userId, includeDeleted) {
        var model = this;
        var defer = Q.defer();

        model.find({ 
            user: userId, 
            isDeleted: !!includeDeleted
        }, function (err, copiedItems) {
            if (err) {
                return defer.reject(err);
            }

            return defer.resolve(copiedItems);
        });  
        
        return defer.promise;
    },
    getCopiedItem: function (userId, copiedItemId, isDeleted) {
        var model = this;
        var defer = Q.defer();

        model.findOne({ 
            _id: copiedItemId,
            user: userId,
            isDeleted: isDeleted
        }, function (err, copiedItem) {
            if (err) {
                return defer.reject(err);
            }

            return defer.resolve(copiedItem);
        });  
        
        return defer.promise;
    },
    upsertCopiedItem: function (user, copiedItemValue, copiedItemId) {
        var model = this;
        var defer = Q.defer();
        var copiedItemInstance = null;
        var newCopiedItem = {
            user: user,
            value: copiedItemValue,
            updatedAt: new Date().getTime()
        };

        Q.when()
        .then(function () {
            var copiedItemDefer = Q.defer();

            if (copiedItemId) {
                model.findOne({_id: copiedItemId}, function (err, copiedItem) {
                    if (err) {
                        return copiedItemDefer.reject(err);
                    }

                    copiedItem = _.assign(copiedItem, newCopiedItem);

                    copiedItemDefer.resolve(copiedItem);
                });
            }
            else {
                copiedItem.createdAt = newCopiedItem.updatedAt;

                copiedItemDefer.resolve(new model(newCopiedItem));
            }

            return copiedItemDefer.promise;
        })
        .then(function (copiedItemInstance) {
            var saveDefer = Q.defer();

            copiedItemInstance.save(function (err) {
                if (err) {
                    return saveDefer.reject(err);
                }
    
                return saveDefer.resolve(copiedItemInstance);
            });

            return saveDefer.promise;
        })
        .then(function (copiedItemInstance) {
            return defer.resolve(copiedItemInstance);
        })
        .catch(function (err) {
            console.log('error', err)
            return defer.reject(err);
        });

        return defer.promise;
    }
};

var CopiedItem = mongoose.model('CopiedItem', CopiedItemSchema);

module.exports = CopiedItem;

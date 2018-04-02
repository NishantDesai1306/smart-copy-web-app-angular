var Q = require('q');
var mongoose = require('mongoose');

var CopiedItemSchema = new mongoose.Schema({
    _id: {
        type: mongoose.Schema.Types.ObjectId,
        require: false
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        require: true
    },
    value: {
        type: String,
        require: true
    },
    createdAt: Number,
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
            _id: userId,
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
        var copiedItem = {
            user: user,
            value: copiedItemValue,
            createdAt: new Date().getTime(),
            _id: null
        };

        if (copiedItemId) {
            copiedItem._id = copiedItemId;
        }
        else {
            copiedItem._id = new mongoose.Types.ObjectId();
        }

        var copiedItemInstance = new model(copiedItem);
        
        copiedItemInstance.save(function (err) {
            if (err) {
                return defer.reject(err);
            }

            return defer.resolve(copiedItemInstance);
        });

        return defer.promise;
    }
};

var CopiedItem = mongoose.model('CopiedItem', CopiedItemSchema);

module.exports = CopiedItem;

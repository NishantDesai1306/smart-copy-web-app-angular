var mongoose = require("mongoose");
var _ = require('lodash');
var CopiedItem = require("./copied-items.model");

exports.getCopiedItems = function (req, res, next) {
    var userId = req.user && req.user._id;

    CopiedItem.getCopiedItems(userId)
    .then(function (copiedItems) {
        res.json({ status: true, data: copiedItems });
    })
    .catch(function(err) {
        console.log(err);
        res.json({
            status: false,
            reason: err.message || err.toString()
        });
    });
};

exports.upsertCopiedItem = function (req, res, next) {
    var userId = req.user && req.user._id;
    var copiedItemValue = req.body.value;
    var copiedItemId = req.body._id;

    if (copiedItemId) {
        CopiedItem.getCopiedItem(userId, copiedItemId)
        .then(function (copiedItem) {

            if (copiedItem) {
                if (!copiedItem.isDeleted || copiedItem.isDeleted && req.body.isMaster) {
                    copiedItem.value = copiedItemValue;
                    copiedItem.createdAt = new Date().getTime();
                    copiedItem.isDeleted = false;
                    copiedItem.save(function (err) {
                        if (err) {
                            console.log(err);
                            return res.json({
                                status: false,
                                reason: err.message || err.toString()
                            });
                        }
                        
                        res.json({
                            status: true,
                            data: _.omit(copiedItem, ['user', '__v'])
                        });
                    });
                }
            }
            else {
                CopiedItem.upsertCopiedItem(userId, copiedItemValue, copiedItemId)
                .then(function (copiedItem) {
                    return res.json({
                        status: true,
                        data: _.omit(copiedItem, ['user', '__v'])
                    });
                })
                .catch(function (err) {
                    return res.json({
                        status: false,
                        reason: err.message || err.toString()
                    });
                });
            }
        })
        .catch(function (err) {
            console.log(err);
            res.json({
                status: false,
                reason: err.message || err.toString()
            });
        });
    }
    else {
        CopiedItem.upsertCopiedItem(userId, copiedItemValue, copiedItemId)
        .then(function (copiedItem) {
            return res.json({
                status: true,
                data: _.omit(copiedItem, ['user', '__v'])
            });
        })
        .catch(function (err) {
            console.log(err);

            return res.json({
                status: false,
                reason: err.message || err.toString()
            });
        });
    }
};

exports.deleteCopiedItem = function (req, res, next) {
    var userId = req.user && req.user._id;
    var removeCopiedItem = req.body;

    CopiedItem.getCopiedItem(userId, removeCopiedItem._id, false)
    .then(function (copiedItem) {
        if (!copiedItem) {
            return res.json({ 
                status: false,
                reason: 'no such item exists'
            });
        }

        if (removeCopiedItem.isMaster) {
            copiedItem.remove(function (err) {
                if (err) {
                    console.log(err);

                    return res.json({
                        status: false,
                        reason: err.message || err.toString()
                    });
                }
                
                res.json({
                    status: true
                });
            });
        }
        else {
            copiedItem.isDeleted = true;
            
            copiedItem.save(function (err) {
                if (err) {
                    console.log(err);

                    return res.json({
                        status: false,
                        reason: err.message || err.toString()
                    });
                }
                
                res.json({
                    status: true
                });
            });
        }
    })
    .catch(function (err) {
        console.log(err);

        return res.json({
            status: false,
            reason: err.message || err.toString()
        });
    });
};

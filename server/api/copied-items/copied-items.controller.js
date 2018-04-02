var mongoose = require("mongoose");
var _ = require('lodash');
var CopiedItem = require("./copied-items.model");

exports.getCopiedItems = function (req, res, next) {

    CopiedItem.getCopiedItems(req.params.user)
    .then(function (copiedItems) {
        res.json({ status: true, copiedItems: copiedItems });
    })
    .catch(function(err) {
        console.log(err);
        res.json({ status: false, reason: err });
    });
};

exports.upsertCopiedItem = function (req, res, next) {
    var user = req.params.user;
    var copiedItemValue = req.body.value;
    var copiedItemId = req.body._id;

    if (copiedItemId) {
        CopiedItem.getCopiedItem(user, copiedItemId)
        .then(function (copiedItem) {

            if (copiedItem) {
                if (!copiedItem.isDeleted || copiedItem.isDeleted && req.body.isMaster) {
                    copiedItem.value = copiedItemValue;
                    copiedItem.createdAt = new Date().getTime();
                    copiedItem.isDeleted = false;
                    copiedItem.save(function (err) {
                        if (err) {
                            console.log(err);
                            res.json({ status: false, reason: err });
                        }
                        else {
                            res.json({ status: true, data: _.omit(copiedItem, ['user', '__v'])});
                        }
                    });
                }
            }
            else {
                CopiedItem.upsertCopiedItem(user, copiedItemValue, copiedItemId)
                .then(function (copiedItem) {
                    return res.json({
                        status: true,
                        data: _.omit(data, ['user', '__v'])
                    });
                })
                .catch(function (err) {
                    return res.json({
                        status: false,
                        reason: err
                    });
                });
            }
        })
        .catch(function (err) {
            console.log(err);
            res.json({ status: false, reason: err });
        });
    }
    else {
        CopiedItem.upsertCopiedItem(user, copiedItemValue, copiedItemId)
        .then(function (copiedItem) {
            return res.json({
                status: true,
                data: _.omit(data, ['user', '__v'])
            });
        })
        .catch(function (err) {
            return res.json({
                status: false,
                reason: err
            });
        });
    }
};

exports.deleteCopiedItem = function (req, res, next) {
    var user = req.params.user;
    var removeCopiedItem = req.body;

    CopiedItem.getCopiedItem(user, removeCopiedItem._id, false)
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
                        reason: err
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
                        reason: err
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
            reason: err
        });
    });
};

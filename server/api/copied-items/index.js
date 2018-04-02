var express = require('express');

var copiedItemsController = require('./copied-items.controller');

var app = express.Router();

app.get('/', copiedItemsController.getCopiedItems);
app.post('/insert', copiedItemsController.upsertCopiedItem);
app.post('/update', copiedItemsController.upsertCopiedItem);
app.post('/delete', copiedItemsController.deleteCopiedItem);

module.exports = app;
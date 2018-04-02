var express = require('express');
var app = express();

app.use('/user', require('./user'));
app.use('/upload', require('./upload'));
app.use('/copied-items', require("./copied-items"));

module.exports = app;
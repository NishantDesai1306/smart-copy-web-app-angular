var express = require('express');
var app = express();

app.use('/user', require('./user'));
app.use('/upload', require('./upload'));

module.exports = app;
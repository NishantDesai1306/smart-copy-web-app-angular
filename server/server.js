// modules =================================================
var express = require('express');
var app = express();
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var morgan = require('morgan');
var mongoose = require('mongoose');
var passport = require('passport');
var session = require('express-session');
var apiRouter = require('./api');
var authRouter = require('./auth');
var salt = require('./config').salt;

//mongoose connect
mongoose.connect('mongodb://localhost/smart-copy');

// set our port
var port = process.env.PORT || 3000;

app.use(morgan('dev'));

app.use(bodyParser.json());
app.use(bodyParser.json({ type: 'application/vnd.api+json' }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride('X-HTTP-Method-Override'));
app.use(cookieParser());

app.use(express.static(path.resolve('./dist')));
app.use('/upload', express.static('upload'));
app.use('/node_modules', express.static('node_modules'));

app.use(session({
    secret: salt,
    saveUninitialized: true,
    resave: true
}));

app.use(passport.initialize());
app.use(passport.session());
app.use(passport.authenticate('remember-me'));

app.use('/auth', authRouter.router);
app.use('/api', authRouter.isAuthenticated, apiRouter);
app.get('*', function(req, res, next) {
    res.sendFile(path.resolve('./dist/index.html'));
});


// start app ===============================================
// startup our app at http://localhost:8080
app.listen(port, function (err) {
    if (err) {
        console.log(err);
    }

    console.log('Magic happens on port ' + port);

    require('./dummyUpload')();
});


// expose app           
exports = module.exports = app;
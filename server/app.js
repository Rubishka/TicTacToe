// dependencies
var express = require('express');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var expressSession = require('express-session');
var mongoose = require('mongoose');
var hash = require('bcrypt-nodejs');
var path = require('path');
var passport = require('passport');
var localStrategy = require('passport-local' ).Strategy;
var io = require('socket.io');

// karma.conf.js
module.exports = function(config) {
    config.set({
        reporters: ['progress', 'junit'],

        // the default configuration
        junitReporter: {
            outputFile: 'test-results.xml',
            suite: ''
        }
    });
};
//heroku config:set PROD_MONGODB=mongodb://Rub:Mlab88@ds159696.mlab.com:59696/user'
var url= 'mongodb://Rub:Mlab88@ds159696.mlab.com:59696/user'
//var url='mongodb://localhost/mean-auth'
// mongoose
mongoose.connect(url);

// user schema/model
var User = require('./models/user.js');

// create instance of express
var app = express();

// require routes
var routes = require('./routes/api.js');

// define middleware
app.use(express.static(path.join(__dirname, '../client')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(require('express-session')({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(path.join(__dirname, 'public')));

// configure passport
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// routes
app.use('/user/', routes);

app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname, '../client', 'index.html'));
});

// error hndlers
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

app.use(function(err, req, res) {
  res.status(err.status || 500);
  res.end(JSON.stringify({
    message: err.message,
    error: {}
  }));
});


for(var i=1; i<=10;i++) {
    var user = new User({
        username: 'user'+i,
        password: 'pass'+i,
        won: [],
        availability: 0
    });
    user.save();
}

module.exports = app;

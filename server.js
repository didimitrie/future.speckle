var express  = require('express');
var app      = express();
var port     = process.env.PORT || 8000;
var mongoose = require('mongoose');
var passport = require('passport');
var flash    = require('connect-flash');
var path = require('path');
var appDir = path.dirname(require.main.filename);

var passport = require("passport");
var strategy = require("./config/passport")

var morgan       = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser   = require('body-parser');
var session      = require('express-session');
var serveStatic  = require('serve-static')


var configDB = require('./config/database.js');

mongoose.connect(configDB.url); 

require('./config/passport'); 

// set up our express application
app.use(morgan('dev')); // log every request to the console
app.use(cookieParser()); // read cookies (needed for auth)
app.use(bodyParser()); // get information from html forms
app.set('view engine', 'jade'); // after some whitespace fighthing, we start to like... jade

// required for passport
app.use(session({ secret: 'shhhhhhh' })); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session

// routes ======================================================================
app.use(serveStatic(__dirname + '/uploads'));

console.log(path.join(__dirname, 'tester'));
require('./app/routes.js')(app, passport, express); // load our routes and pass in our app and fully configured passport

// launch ======================================================================
app.listen(port);
console.log('BugaBuga on ' + port);
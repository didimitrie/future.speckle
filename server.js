var express  = require('express');
var app      = express();
var port     = process.env.PORT || 9009;
//TODO
// var configDir = process.env.CFG || "./config.local"
var mongoose = require('mongoose');
var passport = require('passport');
var flash    = require('connect-flash');
var bodyParser = require("body-parser");
var favicon = require('serve-favicon');

var path     = require('path');
var appDir   = path.dirname(require.main.filename);

var sass     = require('node-sass');
var sassMiddleware = require('node-sass-middleware');

var passport = require("passport");
var strategy = require("./config.local/passport")

var morgan       = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser   = require('body-parser');
var session      = require('express-session');


var configDB = require('./config.local/database.js');

mongoose.connect(configDB.url); 

// favicons <3
app.use(favicon("assets/img/favicon.ico"));

// set up our express application
app.use(morgan('dev')); // log every request to the console

app.use(bodyParser.urlencoded({ extended: true })); // parse post
app.use(bodyParser.json()); // parse post

app.use(cookieParser()); // read cookies (needed for auth)

app.use(bodyParser()); // get information from html forms

app.set('view engine', 'jade'); // after some whitespace fighthing, we start to like... jade

// set up express to use the sass middleware (compiling scss)
app.use(
  sassMiddleware({
    src: './assets/scss',
    dest: './assets/css',
    debug: true,
    prefix:  '/css' // this is important! 
  })
);

// required for passport
app.use(session({ secret: 'shhhhhhh' })); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session


// routes ======================================================================
//app.use('/assets', express.static('assets'));
app.use(express.static('assets'));
app.use('/uploads', express.static('uploads'));
app.use('/view/s/css', express.static('spkw/dist/css'));
app.use('/view/d/css', express.static('spkw/dist/css'));
app.use('/view/s/js', express.static('spkw/dist/js'));
app.use('/view/d/js', express.static('spkw/dist/js'));

require('./app/routes.js')(app, passport, express); // load our routes and pass in our app and fully configured passport

// launch ======================================================================
app.listen(port);
console.log('Bouncing bytes and beats on port ' + port + ". We are actually having fun!");
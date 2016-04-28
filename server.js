var express         = require('express');
var app             = express();
var port            = process.env.PORT || 9009;
var mongoose        = require('mongoose');
var passport        = require('passport');
var bodyParser      = require("body-parser");
var favicon         = require('serve-favicon');
var path            = require('path');
var appDir          = path.dirname(require.main.filename);

var passport        = require("passport");
var strategy        = require("./config/passport")

var morgan          = require('morgan');
var cookieParser    = require('cookie-parser');
var bodyParser      = require('body-parser');
var session         = require('express-session');
var compress        = require('compression');

// connect mongoose up
var configDB        = require('./config/database.js');
mongoose.connect(configDB.url); 

app.use(compress()); 
app.use(favicon("assets/img/favicon.ico"));
app.use(morgan('dev')); 

app.use(bodyParser.urlencoded({ extended: true })); 
app.use(bodyParser.json());
app.use(cookieParser());
app.use(bodyParser());

app.set('view engine', 'jade'); 

// passport ====================================================================
app.use(session({ secret: 'shhhhhhh' }));
app.use(passport.initialize());
app.use(passport.session());

// routes ======================================================================
// get the static routes up - i have a feel this is somewhat stupidly done
app.use(express.static('assets'));
app.use('/uploads', express.static('uploads'));
app.use('/view/css', express.static('spkw/dist/css'));
app.use('/view/js', express.static('spkw/dist/js'));

// dynamic routes come here, after static ones
// there was some trouble with this before
require('./app/routes/frontend.js')(app, passport, express); 
require('./app/routes/modelmanager.js')(app, passport, express); 
require('./app/routes/viewer.js')(app, passport, express); 
require('./app/routes/modelapi.js')(app, passport, express); 

// launch ======================================================================
app.listen(port); 
console.log('Bouncing bytes and beats on port ' + port + "!!!");
console.log(" MADE CHANGE");
console.log(" MADE CHANGE");
var express         = require('express');
var app             = express();
var port            = process.env.PORT || 9009;
var mongoose        = require('mongoose');
var passport        = require('passport');
var bodyParser      = require("body-parser");
var favicon         = require('serve-favicon');
var path            = require('path');
var appDir          = path.dirname(require.main.filename);

var sass            = require('node-sass');
var sassMiddleware  = require('node-sass-middleware');

var passport        = require("passport");
var strategy        = require("./config/passport")

var morgan          = require('morgan');
var cookieParser    = require('cookie-parser');
var bodyParser      = require('body-parser');
var session         = require('express-session');

// connect mongoose up
var configDB        = require('./config/database.js');
mongoose.connect(configDB.url); 

app.use(favicon("assets/img/favicon.ico"));
app.use(morgan('dev')); 
app.use(bodyParser.urlencoded({ extended: true })); 
app.use(bodyParser.json());
app.use(cookieParser());
app.use(bodyParser());

app.set('view engine', 'jade'); 

// sass =========================================================================
app.use(
  sassMiddleware({
    src: './assets/scss',
    dest: './assets/css',
    debug: true,
    prefix:  '/css' // this is important! 
  })
);

// passport ====================================================================
app.use(session({ secret: 'shhhhhhh' }));
app.use(passport.initialize());
app.use(passport.session());


// routes ======================================================================
// get the static routes up - i have a feel this is somewhat stupidly done
app.use(express.static('assets'));
app.use('/uploads', express.static('uploads'));
app.use('/view/s/css', express.static('spkw/dist/css'));
app.use('/view/d/css', express.static('spkw/dist/css'));
app.use('/view/s/js', express.static('spkw/dist/js'));
app.use('/view/d/js', express.static('spkw/dist/js'));

// dynamic routes come here, after static ones
// there was some trouble with this before
require('./app/routes/frontend.js')(app, passport, express); 
require('./app/routes/modelmanager.js')(app, passport, express); 
require('./app/routes/viewer.js')(app, passport, express); 
require('./app/routes/modelapi.js')(app, passport, express); 

// launch ======================================================================
app.listen(port);
console.log('Bouncing bytes and beats on port ' + port + ".");
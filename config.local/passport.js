var passport = require('passport')
var Auth0Strategy = require('passport-auth0')
var AuthDetails = require('./auth-config')

var strategy = new Auth0Strategy({
    domain:        AuthDetails.domain,
    clientID:      AuthDetails.clientId,
    clientSecret:  AuthDetails.clientSecret,
    callbackURL:   '/callback'
}, function(accessToken, refreshToken, extraParams, profile, done) {
    return done(null, profile);
});

passport.use(strategy);

passport.serializeUser(function(user, done) {
    done(null, user);
});

passport.deserializeUser(function(user, done) {
    done(null, user);
});

module.exports = strategy;


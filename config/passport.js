var passport = require('passport')
var Auth0Strategy = require('passport-auth0')
var AuthDetails = require('./auth-config')

var strategy = new Auth0Strategy({
    domain:        AuthDetails.domain,
    clientID:      AuthDetails.clientId,
    clientSecret:  AuthDetails.clientSecret,
    callbackURL:   '/callback'
}, function(accessToken, refreshToken, extraParams, profile, done) {
    console.log('from the strategy:')
    console.log( accessToken  )
    console.log('------------------------------------')
    console.log( refreshToken  )
    console.log('------------------------------------')
    console.log( extraParams  )
    console.log('------------------------------------')
    console.log( profile  )
    console.log('------------------------------------')
    return done( null, profile);
});

passport.use(strategy);

passport.serializeUser(function(user, done) {
    done(null, user);
});

passport.deserializeUser(function(user, done) {
    done(null, user);
});

module.exports = strategy;


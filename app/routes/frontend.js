/**
 *
 *  
 *  Frontend routes:
 *  - homepage
 *  - login
 *  - logout
 *  - authentication callback
 *  - terms
 *  - cookies
 *  
 *  
 */


var User = require('../../app/models/user');
var AuthDetails = require('../../config/auth-config')

module.exports = function( app, passport, express ) {

  app.get( "/", function( req, res ) {
    res.render( "index.jade",  {
      loggedIn : req.isAuthenticated(),
      username : req.user != null ? req.user.nickname : "Anon"
    } );
  } );

  app.get( "/terms", function( req, res ){
    res.render("terms.jade");
  } );

  app.get("/cookies", function( req, res ){
    res.render("cookies.jade");
  } );

  app.get("/login", function( req, res ) {
    res.render("login.jade", {
      authdata : {
        'clientId' : AuthDetails.clientId,
        'domain' : AuthDetails.domain,
        'clientSecret' : AuthDetails.clientSecret,
        'baseUrl' : AuthDetails.baseUrl
      }
    });
  } );

  app.get("/logout", function( req, res ) {
    req.logout();
    res.redirect("/");
  } );

  app.get( "/callback", passport.authenticate( 'auth0', { failureRedirect: '/url-if-something-fails' } ), function( req, res ) {
    if ( !req.user ) 
      throw new Error('user null');
    User.saveUnique( req.user, function( save ) {
      if( save ) {
        var myUser = new User();
        myUser.auth0id = req.user.id;
        myUser.username = req.user.nickname;
        myUser.tier = "Beta Tester";
        myUser.usedStorage = 0;
        myUser.save();
        req.myUser = myUser;
        req.firstVisit = true;
      } else {
        req.myUser = myUser;
        req.firstVisit = false;
      }
      res.redirect("/profile");        
    });
  } );

} // module.exports end

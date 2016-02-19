/**
 *
 * 
 *  Viewer routes:
 *  - single 
 *  - TODO: double/triple 
 *  - TODO: other dashboard configurations should be registered & served here  
 *    would be smart to store all availabe "dashboards" in a json file and parse that automatically
 *
 * 
 */
var path            = require('path')
var appDir          = path.dirname(require.main.filename);

module.exports = function( app, passport, express ) { 
  
  app.get("/view/s/:m", isAuthorized, function(req, res) {
    res.sendfile(appDir + "/spkw/dist/html/Default.html");
  });

} // module.exports end

// this is more a placeholder for future functionality
// ie access tokens and host of other complicated bs
function isAuthorized(req, res, next) {
  return next();
}
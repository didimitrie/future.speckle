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

// functionality sketch; register dashboards somewhere...
var dashboards = [
{
  urlprefix : "s",
  location : "Default.html"
},
{
  urlprefix : "a",
  location : "Default.html"
}];

module.exports = function( app, passport, express ) { 
  
  app.get("/view/s/:m", isAuthorized, function(req, res) {
    res.sendfile(appDir + "/spkw/dist/html/Default.html");
  });

  app.get("/view/m/:m", isAuthorized, function(req, res) {
    res.sendfile(appDir + "/spkw/dist/html/Multiple.html");
  });

  app.get("/view/3/:m", isAuthorized, function(req, res) {
    res.sendfile(appDir + "/spkw/dist/html/Split.html");
  });

  app.get("/view/p/:m", isAuthorized, function(req, res) {
    res.sendfile(appDir + "/spkw/dist/html/Parallel.html");
  });
  
  app.get("/view/a/:m", isAuthorized, function(req, res) {
    res.sendfile(appDir + "/spkw/dist/html/DefaultNewLoader.html");
  });

} // module.exports end

// this is more a placeholder for future functionality
// ie access tokens and host of other complicated bs
function isAuthorized(req, res, next) {
  return next();
}
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

var appDir = path.dirname(require.main.filename);

module.exports = function( app, passport, express ) { 
  
  app.get("/view/s/:m", isAuthorized, function(req, res) {
    res.sendfile(appDir + "/spkw/dist/SPKSingle.html");
  });

  app.get("/view/d/:m", isAuthorized, function(req, res) {
    res.sendfile(appDir + "/spkw/dist/SPKDouble.html");
  });

} // module.exports end

function isAuthorized(req, res, next) {
  return next();
}
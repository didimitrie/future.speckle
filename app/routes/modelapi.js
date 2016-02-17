/**
 *
 * 
 *  Raw API:
 *  - Getting model initial data
 *  - Metadata (usage statistics) collection
 *  - Saved instances getters savers
 *
 * 
 */

var Model           = require('../../app/models/models')
var User            = require('../../app/models/user')
var Session         = require('../../app/models/session')

module.exports = function( app, passport, express ) {

  // This is the first request the viewer does when loading up a model
  // It needs to provide all the necessary info for model loading 
  app.get("/api/model/:m", isAuthorized, function (req, res) { 
    var modelName = req.params.m;
    Model.findOne({urlId: modelName}, function(err, myModel) {
      User.findOne({ auth0id: myModel.ownerId}, function(err, myUser) {
        // This response needs to be pruned and fixed to comm well with the viewer
        // it's too messy right now and it's causing too many problems
        var response = {
          deflateLocation : myModel.deflateLocation,
          modelName : myModel.name,
          dateAdded : myModel.dateAdded,
          ownerName : myUser.username
        }
        res.json(response);
      });
    });
  });

  app.post("/api/model/metadata/", function (req, res) {
    var sessionid = req.body.sessionid;
    var type = req.body.type;
    
    var cb = function(err, session) { res.send("all good for now") }

    switch( type ) {
      case "newSession":
        var mySession = new Session();
        mySession.ip = req.ip; mySession.modelid = req.body.modelid;
        mySession.save( function (err, session) { res.send(session._id) });
      break
      
      case "updateViewport":
        Session.findByIdAndUpdate( sessionid, { $set : {viewportsize: req.body.viewportsize }}, { safe: true }, cb);
      break
      
      case "addInstance":
        Session.findByIdAndUpdate( sessionid, { $push : { "usedinstances" : { key: req.body.key } } }, { safe: true }, cb);
      break
      
      case "addMouseClick":
        Session.findByIdAndUpdate( sessionid, { $push : { "mouseclicks" : { location: req.body.mouseloc}}}, { safe: true }, cb);
      break

      case "sessionend":
        Session.findByIdAndUpdate( sessionid, {$set : {exittime: Date.now() }},  {safe: true}, cb );
      break

      default:
      break
    }
  });

  app.post("/api/model/instances/", function (req, res) {
    var type = req.body.type;
    
    switch(type) {
      case "addnew":
        var modelKey      = req.body.model;
        var myKey         = req.body.key;
        var description   = req.body.description;
        var camerapos     = req.body.camerapos;

        Model.update( 
          { urlId : modelKey }, 
          { $push: { savedInstances: { key: myKey, description: description, camerapos: camerapos, requestip: req.ip } } }, 
          function(err) { res.json("done") });
      break

      case "getsavedinstances":
        var modelKey = req.body.model;
        Model.findOne({urlId: modelKey}, function(err, model) { res.json(model.savedInstances); });
      break

      default:
      break
    }
  });
}

function isAuthorized(req, res, next) {
  return next();
}
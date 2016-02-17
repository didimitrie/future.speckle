

module.exports = function(app, passport, express) {


  /**
   * Get model metadata
   * TODO: get a profesional developer
   */
  
  app.get("/api/model/:m", isAuthorized, function (req, res) {
    
    var modelName = req.params.m;

    Model.findOne({urlId: modelName}, function(err, myModel) {
        
      // TODO: Check for errors along the way
  
      User.findOne({ auth0id: myModel.ownerId}, function(err, myUser) {

        var response = { 
          paramsFile : myModel.deflateLocation + "/" + "/params.json",
          staticGeoFile : myModel.deflateLocation + "/" + "/static.json",
          modelName : myModel.name,
          dateAdded : myModel.dateAdded,
          ownerName : myUser.username
        }

        res.json(response);

      });

    });

  }); 


  // *****************************************************
  //  METADATA ROUTES
  // *****************************************************

  // create & update sesssion with various tracking info
  // possibly a bad pattern to use but i save some typing

  
  // *****************************************************
  //  SAVED INSTANCES MODEL ROUTES
  // *****************************************************
  
  app.post("/api/model/instances/", function (req, res) {

    var type = req.body.type;
    
    
    if(type === "addnew") {
      var modelKey = req.body.model;
      var myKey = req.body.key;
      var description = req.body.description;
      var camerapos = req.body.camerapos;

      Model.update(
        { urlId : modelKey },     
        { $push: {savedInstances : 
          { key: myKey, 
            description: description,
            camerapos: camerapos,
            requestip: req.ip
          } } }, 
        function(err) {
          res.json("done")
      });
    }

    if(type === "getsavedinstances") {

      var modelKey = req.body.model;

      Model.findOne({urlId: modelKey}, function(err, model) {
        console.log(model.savedInstances);
        res.json(model.savedInstances);

      })

    }
    
    //res.json({ allok : "notdone"});

  });



  /**
   * END OF MODULE.EXPORTS
   */
};

// *****************************************************
//	HELPER FUNC / probably should go into controllers, this file is getting unwieldly.
// *****************************************************

function isAuthorized(req, res, next) {
  return next();
}

function isLoggedIn(req, res, next) {
	if(req.isAuthenticated()) {
		User.findOne({auth0id : req.user.id}, function(err, user){
			if(err) res.redirect("/");
			req.myUser = user;
			return next();
		});
	} else 
		res.redirect("/");
}

function getBytesWithUnit( bytes ) {
  if( isNaN( bytes ) ){ return; }
  var units = [ ' bytes', ' KB', ' MB', ' GB', ' TB', ' PB', ' EB', ' ZB', ' YB' ];
  var amountOf2s = Math.floor( Math.log( +bytes )/Math.log(2) );
  if( amountOf2s < 1 ){
    amountOf2s = 0;
  }
  var i = Math.floor( amountOf2s / 10 );
  bytes = +bytes / Math.pow( 2, 10*i );
 
  // Rounds to 3 decimals places.
        if( bytes.toString().length > bytes.toFixed(3).toString().length ){
            bytes = bytes.toFixed(2);
        }
  return bytes + units[i];
}

function getQouta(usedStorage) {
	var maxStorage = 1073741824; // 1 GB
	return (usedStorage/maxStorage * 100);
}

function getFormatedDate() {
  var date = new Date();           var year = date.getUTCFullYear();
  var month = date.getUTCMonth();  var day = date.getUTCDate();
  month = ("0" + (month + 1)).slice(-2);
  year = year.toString().substr(2,2);
  var formattedDate = day + '/' + month + "/" + year;
  return formattedDate;
}
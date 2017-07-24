// config/passport.js
var jwt = require('jsonwebtoken');
var passportJWT = require("passport-jwt");

var ExtractJwt = passportJWT.ExtractJwt;
var JwtStrategy = passportJWT.Strategy;

// load up the user model
var User            = require('../app/models/user');

var jwtOptions = {}
jwtOptions.jwtFromRequest = ExtractJwt.fromAuthHeader();
jwtOptions.secretOrKey = ">wj#~,BJn6c'SH;5)y\BsYv4UGy]TF(A=%]v/m5Z}9\nU>6SntMx\MSJ%e;{H@,9p'";

//this is the middle function that will serve as a gateway to the secret resource
module.exports.strategy = new JwtStrategy(jwtOptions, function(jwt_payload, next) {

  //separate the token in the time and the user_ID to find the user
  var userID = jwt_payload.id.split("-")[1];
  var time = jwt_payload.id.split("-")[0];

  // try to get the user ID from the database and load decide whether or not it should go to the next step
  User.findOne({ 'local.tokenRandVar' :  time, '_id':userID }, function(err, user) {
    
    //if the id is older than a day then do not allow the connection to occure
    var timeOut = 3600*24<(new Date().getTime()/1000-time/1000);

    if (user && ! timeOut) {
      next(null, user);
    } else {
      next(null, false);
    }
  });
});

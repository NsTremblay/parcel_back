var jwt = require('jsonwebtoken');
var jwtOptions = {}
jwtOptions.secretOrKey = ">wj#~,BJn6c'SH;5)y\BsYv4UGy]TF(A=%]v/m5Z}9\nU>6SntMx\MSJ%e;{H@,9p'";

var User = require('../models/user');

module.exports.login = function(app, passport) {
    app.post("/login", function(req, res) {

        console.log(req.body)

        if(req.body.name && req.body.password){
            var name = req.body.name;
            var password = req.body.password;
        }

        console.log(req.body);

        User.findOne({"local.email": name}, function(err, user){

            if( err ){
                res.status(401).json({message:"an error occured"});
                return;
            }
            
            if( ! user ){
                res.status(401).json({message:"noUser"});
                return;
            }

            // if(!user.local.emailConf){
            //     res.status(401).json({message:"noConfirmation"});
            //     return;
            // }

            // if the password is right, then we should send back a JWT
            if(user.validPassword(req.body.password)) {

                var time = (new Date()).getTime();
                user.timeLogin = time;
                var timeLogin = time+"-"+user._id;
                user.local.tokenRandVar = time;
                
                user.save(function(err) {
                    if (err)
                        throw err;
                    var payload = {id: timeLogin};
                    var token = jwt.sign(payload, jwtOptions.secretOrKey);
                    console.log(token);
                    res.json({message: "ok", token: token});
                    return;
                });

            } else {

                res.status(401).json({message:"badPass"});
                return;
            }
        });
    });

    app.post('/testToken',passport.authenticate('jwt', { session: false }), function(req, res){
        console.log(req.body);
        if(req.user!=null){
            res.json({"testResults":"success"})
            return;
        }
    })
}
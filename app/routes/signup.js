var User = require('../models/user');

const nodemailer = require('nodemailer');
'use strict';
// create reusable transporter object using the default SMTP transport
let transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true, // secure:true for port 465, secure:false for port 587
    auth: {
        user: 'ns.tremblay@gmail.com',
        pass: 'imzfetgmeaipndmc'
    }
});


function sendEmail(emailAddress, token, lang) {

    return new Promise((resolve, reject) => {
        console.log(emailAddress + token);

        var subject = "";
        var email = "";


        if (lang == 'en') {
            subject = "Canada Brasil Futebol Academy Email Confirmation";
            email = `
        <link href="https://cdnjs.cloudflare.com/ajax/libs/angular-material/1.1.4/angular-material.css"/>
        <h2>Confirmation email</h2>
        <a href="http://localhost:4200/en/confirmEmail?token=`+ token + `">Confirm Email</a>
        `
        } else if (lang = 'fr') {
            subject = "Confirmation de courriel Academie Canada Brasil Futebol";
            email = `
        <link href="https://cdnjs.cloudflare.com/ajax/libs/angular-material/1.1.4/angular-material.css"/>
        <h2>Courriel de confirmation</h2>
        <a href="http://localhost:4200/fr/confirmEmail?token=`+ token + `">Confirm Email</a>
        `
        }

        // setup email data with unicode symbols
        let mailOptions = {
            from: '"Nicolas Tremblay" <ns.tremblay@gmail.com>', // sender address
            to: emailAddress, // list of receivers
            subject: subject, // Subject line
            html: email// html body
        };
        // send mail with defined transport object
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                reject(console.log(error));
                return false;
            }
            resolve('Message %s sent: %s', info.messageId, info.response);
            console.log('Message %s sent: %s', info.messageId, info.response);
            return true;
        });
    });
}




function sendResetPasswordEmail(emailAddress, token, lang) {

    return new Promise((resolve, reject) => {
        console.log(emailAddress + token);

        var subject = "";
        var email = "";


        if (lang == 'en') {
            subject = "Password reset - Canada Brasil Futebol Academy";
            email = `
            <h2>Confirmation email</h2>
            <a href="http://localhost:4200/en/resetPassword?token=`+ token + `">Confirm Email</a>
            `
        } else if (lang = 'fr') {
            subject = "Ré-initialization du mot de passe Academie Canada Brasil Futebol";
            email = `
            <h2>Ré initialization du mot de passe</h2>
            <a href="http://localhost:4200/fr/resetPassword?token=`+ token + `">Ré-initializer du mot de passe</a>
            `
        }

        // setup email data with unicode symbols
        let mailOptions = {
            from: '"Nicolas Tremblay" <ns.tremblay@gmail.com>', // sender address
            to: emailAddress, // list of receivers
            subject: subject, // Subject line
            html: email// html body
        };
        // send mail with defined transport object
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                reject(console.log(error));
                return false;
            }
            resolve('Message %s sent: %s', info.messageId, info.response);
            console.log('Message %s sent: %s', info.messageId, info.response);
            return true;
        });
    });

}

function makerand() {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (var i = 0; i < 50; i++)
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}


module.exports.signup = function (app, passport) {

    app.post('/signup', function (req, res) {

        if (req.body.name && req.body.password) {
            var name = req.body.name;
            var password = req.body.password;
            var lang = req.body.lang;
        }

        User.findOne({ 'local.email': name }, function (err, user) {

            if (req.body.name && req.body.password) {
                var name = req.body.name;
                var password = req.body.password;
            }
            
            if (err) {
                res.status(401).json({ message: "an error occured" });
            }
            if (user) {
                res.status(401).json({ message: "alreadyExist" });
            } else {
                var newUser = new User();
                // set the user's local credentials
                newUser.local.email = name;
                newUser.local.password = newUser.generateHash(password);
                newUser.local.emailConf = false;
                var emailConfirmationToken = makerand();
                newUser.local.confirmationToken = emailConfirmationToken;
                sendEmail(name, emailConfirmationToken, lang).then((success) => {
                    newUser.save(function (err) {
                        if (err)
                            throw err;

                        res.json({ message: "newUserSuccess" });
                    });
                }, (rejection) => {
                    res.json({ message: "noEmail" });
                });
            }
        });
    })

    app.get('/confirmEmail', function (req, res) {
        User.findOne({ 'local.confirmationToken': req.query.token }, function (err, user) {
            if (err) {
                res.status(401).json({ message: "an error occured" });
            }

            console.log(req.query.token);
            if (user) {
                if (req.query.token === user.local.confirmationToken) {
                    user.local.emailConf = true;
                    user.save(function (err) {
                        if (err)
                            throw err;
                        //setup the endpoint to send an email when the user is created
                        res.json({ message: "confirm" });
                        return;
                    });

                } else {
                    res.json({ message: "noConfirm" });
                    return;
                }
            } else {
                res.status(401).json({ message: "noUser" });
            }
        });
    })


    app.post('/sendResetPassword', function (req, res) {

        var name = req.body.email;
        var lang = req.body.lang;

        User.findOne({ 'local.email': req.body.email }, function (err, user) {
            if (err) { res.status(401).json({ message: "an error occured" }); }
            console.log(req.body.email);
            if (user) {
                var emailConfirmationToken = makerand();
                user.local.passwordResetToken = emailConfirmationToken + "-" + (new Date()).getTime();
                sendResetPasswordEmail(name, emailConfirmationToken, lang).then((success) => {
                    user.save(function (err) {
                        if (err)
                            throw err;

                        res.json({ message: "resetEmailSent" });
                    });
                }, (rejection) => {
                    res.json({ message: "noEmail" });
                });
            } else {
                res.status(401).json({ message: "noUser" });
            }
        });
    })

    app.post('/resetPassword', function (req, res) {
        var password = req.body.password;
        var email = req.body.email;
        var token = req.body.token;

        console.log(req.body);
        User.findOne({ 'local.email': req.body.email }, function (err, user) {
            if (err) { res.status(401).json({ message: "an error occured" }); }
            if (user) {
                //test the token to see if it has expired
                var tokenCreationTime = user.local.passwordResetToken.split("-")[1];
                //if the time difference is less than 10 minutes then the token has not expired
                console.log((new Date()).toString());
                console.log(tokenCreationTime);
                console.log((new Date()).getTime() - tokenCreationTime);

                //now compare the tokens to make sure that it is valid
                if (user.local.passwordResetToken.split("-")[0] === token) {
                    if (((new Date()).getTime() - tokenCreationTime) / 1000 < 600) {
                        user.local.password = user.generateHash(password);
                        user.local.passwordResetToken = "";
                        user.save(function (err) {
                            if (err)
                                throw err;

                            res.json({ message: "passReset" });
                        });
                    } else {
                        res.status(401).json({ message: "expired" })
                    }
                } else {
                    res.status(401).json({ message: "badToken" });
                }

            } else {
                res.status(401).json({ message: "noUser" });
            }
        });
    })

    app.post('/isLoggedIn', passport.authenticate('jwt', { session: false }), function(req,res){

        console.log("show the information for user "+ req.user); 
        res.json({"message":"You have access to the resource "+req.user.local.email+""});
    });
}

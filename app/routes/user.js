var express = require('express');
var User  = require('../models/user');


module.exports = (function() {
    'use strict';
    var router = express.Router();

    // middleware to use for all requests
    router.use(function(req, res, next) {
        // do logging
        console.log('Something is happening.');
        next(); // make sure we go to the next routes and don't stop here
    });


    // on routes that end in /user
    // ----------------------------------------------------
    router.route('/user')

        // create a user (accessed at POST http://localhost:8080/api/user)
        .post(function(req, res) {

            var user = new User();      // create a new instance of the user model
            user.email = req.body.email;  // set the users email (comes from the request)
            User.findOne({ email: user.email}, function (err, doc){
                // doc is a Document
                if(!doc){
                    // save the user and check for errors
                    user.save(function(err) {
                        if (err)
                            res.send(err);
                        res.json({ message: 'user created!' });
                    });
                }else{
                    //check to see if the passwords match

                    res.json({ message: 'This user already exists' });
                }
            });
        })

        // get all the users (accessed at GET http://localhost:8080/api/users)
        .get(function(req, res) {
            User.find(function(err, users) {
                if (err)
                    res.send(err);

                res.json(users);
            });
        });

    // on routes that end in /users/:user_id
    // ----------------------------------------------------
    router.route('/user/:user_id')

        // get the user with that id (accessed at GET http://localhost:8080/api/users/:user_id)
        .get(function(req, res) {
            User.findById(req.params.user_id, function(err, user) {
                if (err)
                    res.send(err);
                res.json(user);
            });
        })

        // update the user with this id (accessed at PUT http://localhost:8080/api/users/:user_id)
        .put(function(req, res) {

            // use our user model to find the user we want
            User.findById(req.params.user_id, function(err, user) {

                if (err)
                    res.send(err);

                user.name = req.body.name;  // update the users info

                // save the user
                user.save(function(err) {
                    if (err)
                        res.send(err);

                    res.json({ message: 'user updated!' });
                });

            });
        })

        // delete the user with this id (accessed at DELETE http://localhost:8080/api/users/:user_id)
        .delete(function(req, res) {
            User.remove({
                _id: req.params.user_id
            }, function(err, user) {
                if (err)
                    res.send(err);

                res.json({ message: 'Successfully deleted' });
            });
        });


    // on routes that end in /user
    // ----------------------------------------------------
    router.route('/login')
        .post(function(req, res) {
            var user = new User();
            user.email = req.body.email;
            user.password = req.body.password;
            console.log(req.body);
            User.findOne({ email: user.email}, function (err, doc){
                // doc is a Document
                if(!doc){
                    res.json({ status: 'wrongusername' });
                }else{
                    //check to see if the passwords match
                    if(doc.password == user.password){
                        res.json({status:"good"});
                    }else{
                        res.json({ status: 'wrongpassword' });
                    }
                }
            });
        });
    router.route('/login/create')
        .post(function(req, res) {
            var user = new User();
            user.email = req.body.email;
            user.password = req.body.password;
            console.log(req.body);
            //create the user
            if(user.password!=req.body.confirmPassword){
                res.json({ status: 'nomatchpassword' });
            }

            user.save(function(err) {
                        if (err)
                            res.send(err);
                        res.json({ status: 'good' });
                    });
        });

    return router;
})();





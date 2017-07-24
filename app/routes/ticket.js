var express = require('express');
var rp = require('request-promise');
var User  = require('../models/user');
var Ticket  = require('../models/ticket');

var googleDirectionsLink = "http://maps.googleapis.com/maps/api/directions/";

//TODO: make this a promise
function getPriceEstimate(req){

}
module.exports.ticket = function(app, passport) {
    'use strict';
    var router = express.Router();

    // middleware to use for all requests
    router.use(function(req, res, next) {
        // do logging
        console.log('Getting Ticket information');
        next(); // make sure we go to the next routes and don't stop here
    });

    // Receive the strings of the from and to addresses and then get the directions
    // ----------------------------------------------------
        app.post('/ticket/estimate',passport.authenticate('jwt', { session: false }),function(req, res) {
            console.log(req.body);
            var ticket = new Ticket();
            //Get Directions and the distance for the optimal trip
            var requestDirections = googleDirectionsLink+"json?origin="+req.body.from_place.formatted_address.replace(/\s/g, "+")+"&destination="+req.body.to_place.formatted_address.replace(/\s/g, "+");
            requestDirections = unescape(encodeURIComponent(requestDirections));
            rp(requestDirections)
            .then(function(googleRoute){
                var directions = JSON.parse(googleRoute);
                //get the time per second
                var duration = directions.routes[0].legs[0].duration.value;
                //base cost
                var timeCost = 5;
                //from 0 to 3600 seconds, increase linearly
                var percentageOfFirstHour = timeCost/3600;
                if(percentageOfFirstHour>=1){
                    timeCost = timeCost+ 3600/500;
                    timeCost = timeCost+ Math.log10(0.00027775*timeCost)/Math.log10(1.001)*.01+5;
                }else{
                    timeCost = timeCost+ duration/500;
                }
                
                //1s is worth 
                console.log(timeCost);
                res.json({price:timeCost});
            }).catch(function (err) {
                // Crawling failed... 
                res.json(err)
                console.log("There was an error"+err);
            })            
        });
    
        app.post('/ticket/submit',passport.authenticate('jwt', { session: false }),function(req, res){
            console.log(req.body);
            res.json({message:"OK"})
        })
    
    return router;
};





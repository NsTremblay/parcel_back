// BASE SETUP
// =============================================================================

// call the packages we need
var express      = require('express');
var app          = express();
var port         = process.env.PORT || 8080;
var mongoose     = require('mongoose');
var passport     = require('passport');
var morgan       = require('morgan');
var cors         = require('cors');
var conf         = require('./env.js');
var bodyParser   = require('body-parser');

app.use(cors());
console.log(process.env.NODE_ENV);
//connect to the mongodb database
mongoose.connect(conf.db.development, {
  useMongoClient: true,
});
// var db = mongoose.connection;
// db.on('error', console.error.bind(console, 'connection error:'));
// db.once('open', function callback () {
//   console.log("Connected to database");
// });

// this will let us get the data from a POST
// app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//use passport strategy for the login
var strategy = require('./config/passport.js').strategy;
passport.use(strategy)
app.use(passport.initialize());

app.use(morgan('dev')); // log every request to the console

// REGISTER OUR ROUTES -------------------------------
require("./app/routes/login.js").login(app, passport);
require("./app/routes/signup.js").signup(app, passport);
require("./app/routes/ticket.js").ticket(app, passport);

// START THE SERVER 
// =============================================================================
app.listen(port);
console.log('Magic happens on port ' + port);



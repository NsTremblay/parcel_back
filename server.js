// BASE SETUP
// =============================================================================

// call the packages we need
var express    = require('express');        // call express
var app        = express();                 // define our app using express
var bodyParser = require('body-parser');    // configure app to use bodyParser()
const conf = require('./env');

var cors = require('cors')
app.use(cors())

var userRouter = require('./app/routes/user');
var ticketRouter = require('./app/routes/ticket');

//connect to the mongodb database
var mongoose   = require('mongoose');
mongoose.connect(conf.conf.mongoconnection);
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function callback () {
  console.log("Connected to database");
});

// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


var port = process.env.PORT || 8080;        // set our port

// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
app.use('/api', userRouter);
app.use('/api', ticketRouter);

// START THE SERVER
// =============================================================================
app.listen(port);

console.log('Magic happens on port ' + port);



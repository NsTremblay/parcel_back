var mongoose = require('mongoose');
var Ticket = require('./ticket').schema;
var Schema = mongoose.Schema;


var UserSchema   = new Schema({

    email: {
        type:String,
        required: true,
        unique: true
    },
    password: String,
    tickets: [Ticket]
});

module.exports = mongoose.model('User', UserSchema);
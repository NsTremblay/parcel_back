var mongoose = require('mongoose');
var Parcel = require('./parcel').schema;
var Schema = mongoose.Schema;


var UserSchema   = new Schema({

    email: {
        type:String,
        required: true,
        unique: true
    },
    password: String,
    players: [Parcel]
});

module.exports = mongoose.model('User', UserSchema);
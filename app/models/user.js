var mongoose = require('mongoose');
var Ticket = require('./ticket').schema;
var Schema = mongoose.Schema;
var bcrypt   = require('bcrypt-nodejs');


var UserSchema   = new Schema({
    local            : {
        email        : String,
        password     : String,
        emailConf    : Boolean,
        tokenRandVar : String,
        confirmationToken: String,
        passwordResetToken :String
    },
    facebook         : {
        id           : String,
        token        : String,
        email        : String,
        name         : String
    },
    twitter          : {
        id           : String,
        token        : String,
        displayName  : String,
        username     : String
    },
    google           : {
        id           : String,
        token        : String,
        email        : String,
        name         : String
    },
    tickets: [Ticket]
});

// methods ======================
// generating a hash
UserSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// checking if password is valid
UserSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.local.password);
};

module.exports = mongoose.model('User', UserSchema);
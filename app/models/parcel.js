var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var ParcelSchema   = new Schema({
    from: String,
    to: String
});

module.exports = mongoose.model('Parcel', ParcelSchema);
var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var TicketSchema   = new Schema({

    origin_coordinates: {
        type:String,
        required:true
    },
    destination_coordinates:{
        type:String,
        required:true
    },
    description: String,
    status:{
        type:String,
        required:true
    },
    price : {
        type:String,
        required:true
    },
    from_place:Object,
    to_place:Object
});

module.exports = mongoose.model('Ticket', TicketSchema);
/**
 * Created by Jones on 8/19/2016.
 */
// get an instance of mongoose and mongoose.Schema
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// set up a mongoose model and pass it using module.exports
module.exports = mongoose.model('Order', new Schema({
    sid: String,
    restaurant_name: String,
    restaurant_contact_num: String,
    customer_name: String,
    customer_contact_num: String,
    Address: String,
    amount: Number,
    status: String,
    created:  { type: Date, default: Date.now },
    updated:  { type: Date}
}));


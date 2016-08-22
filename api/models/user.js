// get an instance of mongoose and mongoose.Schema
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// set up a mongoose model and pass it using module.exports
module.exports = mongoose.model('User', new Schema({
    sid: String,
    name: String,
    email: String,
    password: String,
    salt: String,
    mobile: String,
    role: {type: String},
    admin: Boolean,
    created: { type: Date, default: Date.now },
    updated: { type: Date}
}));
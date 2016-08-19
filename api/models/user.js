// get an instance of mongoose and mongoose.Schema
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// set up a mongoose model and pass it using module.exports
module.exports = mongoose.model('User', new Schema({
    id: String,
    email: String,
    name: String,
    password: String,
    salt: String,
    type: String,
    admin: Boolean,
    created: { type: Date, default: Date.now }
}));
'use strict';
var crypto = require('crypto');

var makeSalt = function(){
    return crypto
            .randomBytes(Math.ceil(len / 2))
            .toString('hex')
            .substring(0, len);
}

var encrypt = function encrypt (password, salt) {
    return crypto
            .createHmac('sha1', salt)
            .update(password)
            .digest('hex');
}

module.exports = {
    makeSalt: makeSalt,
    encrypt: encrypt
}
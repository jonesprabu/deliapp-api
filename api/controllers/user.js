'use strict';
/**
 * Created by Jones on 8/21/2016.
 */
/*
 'use strict' is not required but helpful for turning syntactical errors into true errors in the program flow
 https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Strict_mode
 */

/*
 Modules make it possible to import JavaScript files into your application.  Modules are imported
 using 'require' statements that give you a reference to the module.

 It is a good idea to list the modules that your application depends on in the package.json in the project root
 */
var util    = require('util');
var jwt     = require('jsonwebtoken'); // used to create, sign, and verify tokens
var User    = require('../models/user');
var appConfig = require('../../config/config');





/*
 Functions in a127 controllers used for operations should take two parameters:

 Param 1: a handle to the request object
 Param 2: a handle to the response object
 */
var createInitialUser = function (req, res) {

    var initialUser = new User({
        sid: "deliapp",
        name: "Deliapp",
        email: "j1s.deliapp@gmail.com",
        password: "J1sDeliapp",
        salt: "",
        mobile: "9884948041",
        role: "admin",
        admin: true
    });

    User.findOne({"id":"deliapp"}).exec(function(err, doc){
        console.log("user doc -- ", doc);
        if(err) throw err;
        if(doc) { res.status(400).json({message: 'Setup already done'}); }
        else {
            initialUser.save(function(err){
                if(err) throw err;
                console.log('User saved successfully');
                res.status(200).json({ success: true, message: 'Initial user saved successfully' });
            })
        }
    });
}


/*
 Functions in a127 controllers used for operations should take two parameters:

 Param 1: a handle to the request object
 Param 2: a handle to the response object
 */
var usersList = function (req, res) {
    User.find({}).exec(function(err, doc){
        if(err) throw err;
        if(doc && doc.length>0) { res.status(200).json(doc); }
        else { res.status(400).json("No Users found") }
    });
}

/*
 Functions in a127 controllers used for operations should take two parameters:

 Param 1: a handle to the request object
 Param 2: a handle to the response object
 */
var authenticate = function(req, res) {

    var email = req.body.email;
    var passw = req.body.password;
    var secretText = appConfig.secret;
    var tokenExpiresIn = appConfig.tokenExpiresIn;

    if(!email || !passw){
        res.status(400).json({ success: false, message: 'Email and Password Required' });
        return;
    }
    // find the user
    User.findOne({
        email: email
    }, function(err, user) {

        if (err) throw err;

        if (!user) {
            res.status(400).json({ success: false, message: 'Authentication failed. User not found.' });
            return;
        } else if (user) {

            // check if password matches
            if (user.password != passw) {
                res.status(400).json({ success: false, message: 'Authentication failed. Wrong password.' });
                return;
            } else {

                // if user is found and password is right
                // create a token
                var token = jwt.sign(user, secretText, {
                    "expiresIn": tokenExpiresIn // expires in 24 hours
                });
                console.log("token ---- ", token);
                delete user.__v;
                var data = {
                    token: token,
                    user: user
                }
                console.log(data);
                // return the information including token as JSON
                res.status(200).json(data);
                return;
            }

        }

    });
};



/*
 Once you 'require' a module you can reference the things that it exports.  These are defined in module.exports.

 For a controller in a127 (which this is) you should export the functions referenced in your Swagger document by name.

 Either:
 - The HTTP Verb of the corresponding operation (get, put, post, delete, etc)
 - Or the operationId associated with the operation in your Swagger document

 In the starter/skeleton project the 'get' operation on the '/hello' path has an operationId named 'hello'.  Here,
 we specify that in the exports of this module that 'hello' maps to the function named 'hello'
 */
module.exports = {
    createInitialUser: createInitialUser,
    usersList: usersList,
    authenticate: authenticate
};
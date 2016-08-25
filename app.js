'use strict';

var SwaggerExpress = require('swagger-express-mw'),
    cors        = require('cors'),
    app         = require('express')(),
    bodyParser  = require('body-parser'),
    morgan      = require('morgan'),
    mongoose    = require('mongoose'),
    User        = require('./api/models/user'),
    nev         = require('email-verification')(mongoose);

var appConfig = require('./config/config'); // get our config file

module.exports = app; // for testing

app.use(cors());

var config = {
  appRoot: __dirname // required config
};

mongoose.connect(appConfig.database); // connect to database
mongoose.Promise = global.Promise;

app.set('superSecret', appConfig.secret); // secret variable
app.set('tokenExpiresIn', appConfig.tokenExpiresIn);

// use body parser so we can get info from POST and/or URL parameters
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// use morgan to log requests to the console
app.use(morgan('dev'));

// Email verification for new users
nev.configure({
    verificationURL: appConfig.userVerificationURL+'${URL}',
    persistentUserModel: User,
    tempUserCollection: 'Non_Verified_User',

    transportOptions: {
        service: 'Gmail',
        auth: {
            user: appConfig.ADMIN_EMAIL,
            pass: appConfig.ADMIN_EMAIL_PW_HASH
        }
    },
    verifyMailOptions: {
        from: 'Do Not Reply '+appConfig.ADMIN_EMAIL,
        subject: 'Please confirm account',
        html: 'Click the following link to confirm your account:</p><p>${URL}</p>',
        text: 'Please confirm your account by clicking the following link: ${URL}'
    },
    hashingFunction: function(){
    }
}, function(error, options){
});

SwaggerExpress.create(config, function(err, swaggerExpress) {
  if (err) { throw err; }

  // install middleware
  swaggerExpress.register(app);

  var port = process.env.PORT || 10010;
  app.listen(port);


  if (swaggerExpress.runner.swagger.paths['/hello']) {
    console.log('try this:\ncurl http://127.0.0.1:' + port + '/hello?name=Scott');
  }
});

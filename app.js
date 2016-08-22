'use strict';

var SwaggerExpress = require('swagger-express-mw');
var cors = require('cors');
var app = require('express')();
var bodyParser  = require('body-parser');
var morgan      = require('morgan');
var mongoose    = require('mongoose');

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

'use strict';

var SwaggerExpress = require('swagger-express-mw');
var cors = require('cors')
var app = require('express')();
module.exports = app; // for testing

var config = {
  appRoot: __dirname // required config
};

app.use(cors());
/*app.configure(function() {
    app.use(function(req, res, next) {
      res.header("Access-Control-Allow-Origin", "127.0.0.1:53801");
      res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
      res.header('Access-Control-Allow-Headers', 'Content-Type');
      next();
    });
});*/

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

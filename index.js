const app = require('./app.js');

module.exports.handler = (event, context, callback) => {
  app.handle(event, data => {
    callback(null, data);
  });
};



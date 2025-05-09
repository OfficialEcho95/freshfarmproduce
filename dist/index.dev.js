"use strict";

/* eslint-disable linebreak-style */

/* eslint-disable indent */
// eslint-disable-next-line linebreak-style

/* eslint-disable jest/require-hook */

/* eslint-disable linebreak-style */
var app = require('./server');

var PORT = process.env.PORT || 3001;

if (process.env.NODE_ENV !== 'test') {
  console.log('Starting the server...');
  app.listen(PORT, function () {
    console.log("Server started on http://localhost:".concat(PORT));
  });
} else {
  console.log('Running in test mode - server not started');
}

module.exports = app;
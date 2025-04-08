"use strict";

/* eslint-disable linebreak-style */

/* eslint-disable indent */
// eslint-disable-next-line linebreak-style

/* eslint-disable jest/require-hook */

/* eslint-disable linebreak-style */
var app = require('./server');

if (process.env.NODE_ENV !== 'test') {
  console.log('Starting the server...');
  app.listen(0, function () {
    // Dynamically assigns an available port
    console.log('Server started on random available port');
  });
} else {
  console.log('Running in test mode - server not started');
}

module.exports = app;
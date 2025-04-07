"use strict";

/* eslint-disable linebreak-style */

/* eslint-disable indent */
// eslint-disable-next-line linebreak-style

/* eslint-disable jest/require-hook */

/* eslint-disable linebreak-style */
var app = require('./server');

if (process.env.NODE_ENV !== 'test') {
  console.log('Starting the server...');
  app.listen(process.env.PORT || 3001, function () {
    console.log('Server is running on port 3001');
  });
}

module.exports = app;
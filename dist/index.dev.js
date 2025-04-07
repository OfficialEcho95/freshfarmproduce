"use strict";

/* eslint-disable linebreak-style */

/* eslint-disable indent */
// eslint-disable-next-line linebreak-style

/* eslint-disable jest/require-hook */

/* eslint-disable linebreak-style */
var app = require('./server');

var PORT = process.env.PORT || 3000;
app.listen(PORT, function () {
  console.log('Server listening on port:', PORT);
});
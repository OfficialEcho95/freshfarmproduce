"use strict";

require('dotenv').config();

var express = require('express');

var app = express();

var path = require('path');

var cors = require('cors');

var session = require('express-session');

var MongoStore = require('connect-mongo');

var dbConnect = require('./backend/db/db');

var PORT = process.env.PORT || 3000;

var userRoutes = require('./backend/users/routes/usersRoutes');

var adminRoutes = require('./backend/admin/routes/adminRoutes');

dbConnect();
app.use(express.json());
app.use(session({
  secret: process.env.SESSION_SECRET_KEY,
  resave: false,
  saveUninitialized: true,
  cookie: {
    maxAge: 60 * 1000 * 60 * 3,
    secure: false
  },
  store: MongoStore.create({
    mongoUrl: process.env.DB_AUTHENTICATION
  })
})); // Serve favicon

app.use(cors()); // Serve static files from the 'frontend' directory

app.use(express["static"](path.join(__dirname, 'frontend')));
app.use(express["static"](path.join(__dirname, 'frontend/js/html'))); // Serve static files from the commodityUploads directory

app.use('/commodityUploads', express["static"](path.join(__dirname, '/commodityUploads'))); // app.use('/api/v1/users', userRoutes);

app.use('/api/v1/admin', adminRoutes);
app.use('/api/v1/users', userRoutes);
app.listen(PORT, function () {
  console.log('Server listening on port:', PORT);
});
module.exports = {
  app: app
};
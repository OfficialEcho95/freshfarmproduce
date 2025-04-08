/* eslint-disable jest/require-hook */
// server.js
require('dotenv').config();
const express = require('express');
const path = require('path');
const cors = require('cors');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const dbConnect = require('./backend/db/db');

const app = express();
const userRoutes = require('./backend/users/routes/usersRoutes');
const adminRoutes = require('./backend/admin/routes/adminRoutes');

dbConnect();

app.use(express.json());
app.use(
  session({
    secret: process.env.SESSION_SECRET_KEY,
    resave: false,
    saveUninitialized: true,
    cookie: {
      maxAge: 60 * 1000 * 60 * 3,
      secure: false,
    },
    store: MongoStore.create({
      mongoUrl: process.env.DB_AUTHENTICATION,
    }),
  }),
);

app.use(cors());
app.use(express.static(path.join(__dirname, 'frontend')));
app.use(express.static(path.join(__dirname, 'frontend/js/html')));
app.use('/commodityUploads', express.static(path.join(__dirname, '/commodityUploads')));

app.use('/api/v1/admin', adminRoutes);
app.use('/api/v1/users', userRoutes);

app.get('/health', (req, res) => {
  res.status(200).send('OK');
});

module.exports = app;

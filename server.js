require('dotenv').config();
const express = require('express');
const app = express();
const path = require('path');
const cors = require('cors');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const dbConnect = require('./backend/db/db');
const PORT = process.env.PORT || 3000;
const userRoutes = require('./backend/users/routes/usersRoutes');
const adminRoutes = require('./backend/admin/routes/adminRoutes');

dbConnect();

app.use(express.json())
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
       mongoUrl: process.env.DB_AUTHENTICATION
    }),
  })
);

// Serve favicon

app.use(cors());

// Serve static files from the 'frontend' directory
// app.use(express.static(path.join(__dirname, 'frontend')));
// app.use(express.static(path.join(__dirname, 'frontend/js/html')));

// Serve static files from the commodityUploads directory
app.use('/commodityUploads', express.static(path.join(__dirname, '/commodityUploads')));


// app.use('/api/v1/users', userRoutes);
app.use('/api/v1/admin', adminRoutes);
app.use('/api/v1/users', userRoutes);

app.listen(PORT, ()=>{
    console.log('Server listening on port:', PORT);
})
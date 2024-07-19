const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const authRoutes = require('./routes/auth');
const profileRoute = require('./routes/profile');
const usersRoute = require('./routes/users');
const friendsRoute = require('./routes/friends');
const eventsRoute = require('./routes/event');

const verifyToken = require('./middleware/auth');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;
const MONGODB_URI = process.env.MONGODB_URI;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/auth', authRoutes);
app.use('/api/profile', verifyToken, profileRoute);
app.use('/api/users', verifyToken, usersRoute);
app.use('/api/friends', verifyToken, friendsRoute);
app.use('/api/events', verifyToken, eventsRoute);

app.get('/', (req, res) => {
  res.render('landing');
});

app.get('/login', (req, res) => {
  res.render('login');
});

app.get('/signup', (req, res) => {
  res.render('signup');
});

app.get('/profile', (req, res) => {
    res.render('profile');
});

app.get('/users', (req, res) => {
  res.render('users');
});

app.get('/messages', (req, res) => {
  res.render('messages');
});

app.get('/createEvent', (req, res) => {
  res.render('createEvent');
});

mongoose.connect(MONGODB_URI, {})
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Internal Server Error' });
});

process.on('unhandledRejection', (err, promise) => {
  console.error(`Unhandled Rejection: ${err.message}`);
  server.close(() => process.exit(1));
});

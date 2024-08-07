const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const authRoutes = require('./routes/auth');
const profileRoute = require('./routes/profile');
const usersRoute = require('./routes/users');
const friendsRoute = require('./routes/friends');
const eventsRoute = require('./routes/event');
const playlistRoute = require('./routes/playlist');
const nocache = require('nocache');

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
app.use(nocache());

app.use('/auth', authRoutes);
app.use('/api/profile', verifyToken, profileRoute);
app.use('/api/users', verifyToken, usersRoute);
app.use('/api/friends', verifyToken, friendsRoute);
app.use('/api/events', verifyToken, eventsRoute);
app.use('/api/playlists', verifyToken, playlistRoute);

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

app.get('/viewEvents', (req, res) => {
  res.render('viewEvent');
});

app.get('/createPlaylist', (req, res) => {
  res.render('createPlaylist');
});

app.get('/playlists', (req, res) => {
  res.render('playlists');
});

app.get('/createMusic', (req, res) => {
  res.render('createMusic');
});

app.get('/meetingRoom', (req, res) => {
  const data = {
    appid: process.env.APP_ID,
    token: process.env.TOKEN,
    channel: process.env.CHANNEL
  };

  res.render('meetingRoom', data);
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

  app.use((req, res) => {
    res.status(404).sendFile(path.join(__dirname, 'public', '404.html'));
});

process.on('unhandledRejection', (err, promise) => {
  console.error(`Unhandled Rejection: ${err.message}`);
  server.close(() => process.exit(1));
});

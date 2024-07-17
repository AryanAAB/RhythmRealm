const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const UserPreference = require('../models/UserPreference');
const UserLocation = require('../models/UserLocation');
const getCoordinates = require('../geocode');

router.post('/signup', async (req, res) => {
  try {
    const { username, email, password, location } = req.body;
    const {latitude, longitude} = await getCoordinates(location);

    const user = new User({ username, email, password });
    const userPreference = new UserPreference({ userId: user._id, instruments: [], musicTastes: [] });

    const userLocation = new UserLocation({ userId: user._id, location: location, latitude: latitude, longitude: longitude });
    await user.save();
    await userPreference.save();
    await userLocation.save();
    res.status(201).json({ message: "Registration was successful!" });
  } catch (error) {
    res.status(400).json({ message: "The username already exists. Try another username instead." });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) throw new Error('User not found');

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new Error('Invalid credentials');

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;

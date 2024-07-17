const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require("../models/User");
const UserPreference = require("../models/UserPreference");
const UserLocation = require('../models/UserLocation');
const getCoordinates = require('../geocode');

router.get('/', async (req, res) => {
    const token = req.headers.authorization.split(' ')[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const user = await User.findById(decoded.userId);
        
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        
        const preferences = await UserPreference.find({ userId: user._id }).populate().exec();
        const location = await UserLocation.find({userId: user._id}).populate().exec();
        res.status(200).json({
            username: user.username,
            email: user.email,
            preferences: preferences,
            location: location[0]["location"]
        });
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch profile' });
    }
});

router.post('/', async (req, res) => {
    const token = req.headers.authorization.split(' ')[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const user = await User.findById(decoded.userId);
        
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const { instruments, music } = req.body;
        await UserPreference.findOneAndUpdate(
            { userId: user._id },
            { instruments: instruments, musicTastes: music },
            { upsert: true, new: true }
        );

        res.status(200).json({ message: 'Preferences updated successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Failed to update preferences' });
    }
});

router.post('/updateLocation', async (req, res) => {
    const token = req.headers.authorization.split(' ')[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const user = await User.findById(decoded.userId);
        
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const { location } = req.body;
        const {latitude, longitude} = await getCoordinates(location);
        await UserLocation.findOneAndUpdate(
            { userId: user._id },
            { location: location, latitude: latitude, longitude: longitude },
            { upsert: true, new: true}
        );

        res.status(200).json({ message: 'Location updated successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Failed to update location' });
    }
});

module.exports = router;
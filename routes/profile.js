const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require("../models/User");
const UserPreference = require("../models/UserPreference");
const UserLocation = require('../models/UserLocation');
const getCoordinates = require('../geocode');

/**
 * Route to get the current user's profile, including preferences and location.
 * 
 * This route fetches the current user's details from the JWT token, including preferences and location.
 * 
 * @param {Object} req - The request object containing the HTTP request information.
 * @param {Object} res - The response object to send the HTTP response.
 */
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

/**
 * Route to update or create user preferences.
 * 
 * This route updates the current user's preferences, including musical instruments and music tastes.
 * 
 * @param {Object} req - The request object containing the HTTP request information.
 * @param {Object} res - The response object to send the HTTP response.
 */
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

/**
 * This route updates the user's location information in the `UserLocation` collection.
 * It requires authentication via a JWT token in the `Authorization` header.
 * The route extracts the user's location from the request body, retrieves latitude and longitude using
 * the `getCoordinates` function, and updates or creates the `UserLocation` entry for the user.
 *
 * @param {Object} req.headers - Request headers containing JWT token for authentication
 * @param {Object} req.body - Request body containing the new location
 */
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
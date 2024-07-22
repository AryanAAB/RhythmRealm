const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require("../models/User");
const UserPreference = require("../models/UserPreference");
const UserLocation = require("../models/UserLocation");
const UserFriends = require("../models/UserFriends");

/**
 * Route to get the list of users and the current user's details, preferences, location, and friends.
 * 
 * This route fetches the current user's details from the JWT token, including preferences, location, 
 * and friends. It also fetches other users' details, optionally filtered by matching preferences 
 * with the current user. The results include users' preferences and location information.
 * 
 * @param {Object} req - The request object containing the HTTP request information.
 * @param {Object} res - The response object to send the HTTP response.
 */
router.get('/', async (req, res) => {
    const token = req.headers.authorization.split(' ')[1];
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.userId).exec();

        // Fetch the current user's preferences, location, and friends
        const currUserPreferences = await UserPreference.findOne({ userId: user._id }).exec();
        const currUserLocation = await UserLocation.findOne({ userId: user._id }).exec();
        const currUserFriends = await UserFriends.find({
            $or: [
              { sender: user._id },
              { recipient: user._id }
            ]
        }).populate("sender").populate("recipient").exec();

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        let users;

        // If filtering by preferences is requested
        if (req.query.filterByPreferences) {
            const currentUserPreferences = await UserPreference.findOne({ userId: user._id }).exec();
            if (!currentUserPreferences) {
                return res.status(404).json({ message: 'User preferences not found' });
            }

            users = await User.find({
                _id: { $ne: user._id }
            }).exec();

            // Filter users based on matching preferences
            const filteredUsers = [];
            for (const u of users) {
                const userPreferences = await UserPreference.findOne({ userId: u._id }).exec();
                const userLocation = await UserLocation.findOne({ userId: u._id }).exec();
                if (userPreferences && (
                    currentUserPreferences.instruments.some(instrument => userPreferences.instruments.includes(instrument)) ||
                    currentUserPreferences.musicTastes.some(taste => userPreferences.musicTastes.includes(taste))
                )) {
                    filteredUsers.push({ 
                        ...u._doc, 
                        preferences: userPreferences, 
                        location: userLocation || {} 
                    });
                }
            }
            users = filteredUsers;
        } else {
            users = await User.find({ _id: { $ne: user._id } }).exec();
            const usersWithPreferences = [];

            // Fetch preferences and location for each user
            for (const u of users) {
                const userPreferences = await UserPreference.findOne({ userId: u._id }).exec();
                const userLocation = await UserLocation.findOne({ userId: u._id }).exec();
                usersWithPreferences.push({ 
                    ...u._doc, 
                    preferences: userPreferences || {}, 
                    location: userLocation || {} 
                });
            }
            users = usersWithPreferences;
        }

        // Return the list of users, current user's details, preferences, location, and friends in the response
        res.status(200).json({
            users: users,
            user: user,
            currUserPreferences: currUserPreferences,
            currUserLocation: currUserLocation,
            currUserFriends: currUserFriends
        });

    } catch (error) {
        res.status(500).send('Error fetching users');
    }
});

module.exports = router;

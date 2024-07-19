const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require("../models/User");
const UserPreference = require("../models/UserPreference");
const UserLocation = require("../models/UserLocation");
const UserFriends = require("../models/UserFriends");

router.get('/', async (req, res) => {
    const token = req.headers.authorization.split(' ')[1];
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.userId).exec();
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
        if (req.query.filterByPreferences) {
            const currentUserPreferences = await UserPreference.findOne({ userId: user._id }).exec();
            if (!currentUserPreferences) {
                return res.status(404).json({ message: 'User preferences not found' });
            }

            users = await User.find({
                _id: { $ne: user._id }
            }).exec();

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

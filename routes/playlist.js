const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const Playlist = require('../models/Playlist');
const Track = require('../models/Track');
const User = require('../models/User');

router.post('/', async (req, res) => {
    const token = req.headers.authorization.split(' ')[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const user = await User.findById(decoded.userId);
        
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const {name, description, trackIds} = req.body;

        if(!trackIds || trackIds.length === 0)
            return res.status(400).json({error: "At least one track must be added to the playlist."});

        const newPlaylist = new Playlist({
            name,
            description,
            userId: user._id,
            tracks: trackIds
        });

        await newPlaylist.save();
        res.status(201).json(newPlaylist);
    } catch (error) {
        res.status(500).json({ message: 'Failed to create a playlist.' });
    }
});

router.get('/', async (req, res) => {
    const token = req.headers.authorization.split(' ')[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const user = await User.findById(decoded.userId);
        
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const playlists = await Playlist.find({ userId: user._id }).populate('tracks');

        res.status(200).json(playlists);
    } catch (error) {
        res.status(500).json({ message: 'Failed to create a playlist.' });
    }
});

router.put('/:id', async (req, res) => {
    try {
        const { name, description, trackIds } = req.body;

        if (!trackIds || trackIds.length === 0) {
            return res.status(400).json({ error: 'At least one track must be added to the playlist.' });
        }

        const updatedPlaylist = await Playlist.findByIdAndUpdate(
            req.params.id,
            { name, description, tracks: trackIds },
            { new: true }
        ).populate('tracks');

        res.status(200).json(updatedPlaylist);
    } catch (error) {
        res.status(500).json({ error: "Failed to update playlist." });
    }
});

router.post('/tracks', async (req, res) => {
    const token = req.headers.authorization.split(' ')[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const user = await User.findById(decoded.userId);
        
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const { title, artist, album, url } = req.body;
        const newTrack = new Track({ title, artist, album, url });
        await newTrack.save();
        res.status(201).json(newTrack);

    } catch (error) {
        res.status(500).json({ message: 'Failed to create a playlist.' });
    }
});

router.delete('/tracks/:trackId', async (req, res) => {
    const token = req.headers.authorization.split(' ')[1];

    try {
        const { trackId } = req.params;

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const user = await User.findById(decoded.userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        await Track.deleteOne({ _id: trackId });

        res.status(200).json({ message: 'Track deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
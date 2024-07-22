const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const Playlist = require('../models/Playlist');
const Track = require('../models/Track');
const User = require('../models/User');

/**
 * Route to create a new playlist for the authenticated user.
 * 
 * This route requires a valid JWT token for authentication. It extracts the token 
 * from the Authorization header, verifies it, and uses the decoded user ID to identify 
 * the user. If the user is found in the database, the route proceeds to create a new 
 * playlist with the provided name, description, and track IDs. At least one track ID 
 * must be provided to create the playlist. The new playlist is then saved to the 
 * database and returned in the response. If the token is missing or invalid, if the 
 * user is not found, or if there is an error during the creation process, an appropriate 
 * error response is sent.
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

/**
 * Route to get all playlists of the authenticated user.
 * 
 * This route requires a valid JWT token for authentication. It extracts the token 
 * from the Authorization header, verifies it, and uses the decoded user ID to identify 
 * the user. If the user is found in the database, the route proceeds to retrieve all 
 * playlists created by the user, populating the track details for each playlist. The 
 * playlists are then returned in the response. If the token is missing or invalid, if 
 * the user is not found, or if there is an error during the retrieval process, an 
 * appropriate error response is sent.
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

        const playlists = await Playlist.find({ userId: user._id }).populate('tracks');

        res.status(200).json(playlists);
    } catch (error) {
        res.status(500).json({ message: 'Failed to create a playlist.' });
    }
});

/**
 * Route to update an existing playlist.
 * 
 * This route updates the details of a specified playlist using the provided playlist ID.
 * It validates the request body to ensure that at least one track is included in the 
 * updated playlist. The playlist is then updated with the new name, description, and 
 * track IDs, and the updated playlist is populated with track details before being 
 * returned in the response. If there is an error during the update process, an 
 * appropriate error response is sent.
 * 
 * @param {Object} req - The request object containing the HTTP request information.
 * @param {Object} res - The response object to send the HTTP response.
 */
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

/**
 * Route to add a new track.
 * 
 * This route adds a new track to the database. It first verifies the user's JWT token 
 * and ensures the user exists. If the user is authenticated and exists, it proceeds 
 * to create a new track with the provided title, artist, album, and URL, and saves 
 * it to the database. The newly created track is then returned in the response. If 
 * there is an error during the process, an appropriate error response is sent.
 * 
 * @param {Object} req - The request object containing the HTTP request information.
 * @param {Object} res - The response object to send the HTTP response.
 */
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

/**
 * Route to delete a track by its ID.
 * 
 * This route deletes a track from the database based on the provided track ID. It first 
 * verifies the user's JWT token and ensures the user exists. If the user is authenticated 
 * and exists, it proceeds to delete the track with the specified ID from the database. 
 * A success message is returned in the response if the deletion is successful. If there 
 * is an error during the process, an appropriate error response is sent.
 * 
 * @param {Object} req - The request object containing the HTTP request information.
 * @param {Object} res - The response object to send the HTTP response.
 */
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
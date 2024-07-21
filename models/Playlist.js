const mongoose = require('mongoose');

/**
 * Creates an playlist schema that specifies the structure of a user playlist document in MongoDB.
 * 
 * This schema defines the fields and their types, along with any necessary validation
 * rules for the playlist collection in the database. Each playlist has a name, description, 
 * user id, and the music tracks.
 */
const playlistSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    tracks: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Track', required: true }],
}, { timestamps: true });

module.exports = mongoose.model('Playlist', playlistSchema);
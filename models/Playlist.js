const mongoose = require('mongoose');

const playlistSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    tracks: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Track', required: true }],
    sharedWith: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
}, { timestamps: true });

module.exports = mongoose.model('Playlist', playlistSchema);
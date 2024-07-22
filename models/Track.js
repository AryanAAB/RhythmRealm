const mongoose = require('mongoose');

/**
 * Creates a track schema that specifies the structure of a music track document in MongoDB.
 * 
 * This schema defines the fields and their types, along with any necessary validation
 * rules for the music track collection in the database. Each track has a title, and 
 * optional fields for artist, album, and url. 
 */
const trackSchema = new mongoose.Schema({
    title: { type: String, required: true },
    artist: { type: String },
    album: { type: String },
    url: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('Track', trackSchema);
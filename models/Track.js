const mongoose = require('mongoose');

const trackSchema = new mongoose.Schema({
    title: { type: String, required: true },
    artist: { type: String },
    album: { type: String },
    url: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('Track', trackSchema);
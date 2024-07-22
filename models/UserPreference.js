const mongoose = require('mongoose');
const Schema = mongoose.Schema;

/**
 * Creates a user preference schema that specifies the structure of a user preference
 * document in MongoDB.
 * 
 * This schema defines the fields and their types, along with any necessary validation
 * rules for the user preference collection in the database. Each user preference has a
 * user id, a list of instruments that the user likes to play, and a list of music tastes
 * that he or she has. 
 */
const userPreferenceSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  instruments: { type: [String], default: [] },
  musicTastes: { type: [String], default: [] }
});

module.exports = mongoose.model('UserPreference', userPreferenceSchema);
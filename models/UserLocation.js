const mongoose = require('mongoose');

/**
 * Creates a user location schema that specifies the structure of a user location 
 * document in MongoDB.
 * 
 * This schema defines the fields and their types, along with any necessary validation
 * rules for the user location collection in the database. Each user location has a user
 * id, the location that the user entered as a string, and the latitutde and longitude of
 * that locaiton.
 */
const UserLocationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  location: {
    type: String,
    required: true
  },
  latitude: {
    type: Number,
    required: true
  },
  longitude: {
    type: Number,
    required: true
  }
});

module.exports = mongoose.model('UserLocation', UserLocationSchema);

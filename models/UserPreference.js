const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userPreferenceSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  instruments: { type: [String], default: [] },
  musicTastes: { type: [String], default: [] }
});

module.exports = mongoose.model('UserPreference', userPreferenceSchema);
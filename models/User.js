const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

/**
 * Creates a user schema that specifies the structure of a user document in MongoDB.
 * 
 * This schema defines the fields and their types, along with any necessary validation
 * rules for the user collection in the database. Each user has a username, email, password
 * and a list of music preferences. 
 */
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  preference: { type: mongoose.Schema.Types.ObjectId, ref: 'UserPreference' }
});

// Pre-save hook to hash the password before saving the user document
userSchema.pre('save', async function(next) {
  const user = this;
  if (!user.isModified('password')) return next();
  const hashedPassword = await bcrypt.hash(user.password, 10);
  user.password = hashedPassword;
  next();
});

const User = mongoose.model('User', userSchema);

module.exports = User;

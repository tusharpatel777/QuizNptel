const mongoose = require('mongoose');

// This is a basic User model. You can expand it with authentication fields (email, password, etc.)
// if you decide to implement user accounts and personalized progress tracking.
const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  // In a real app, password would be hashed
  password: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('User', UserSchema);
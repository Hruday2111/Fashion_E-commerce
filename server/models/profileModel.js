const mongoose = require('mongoose');
const userProfileSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    dateOfBirth: { type: Date, required: true },
    gender: { type: String, enum: ['Male', 'Female', 'Other'], default: 'Other' },
    Address: { type: String, default: '' },
    phoneNumber: { type: String, default: '' },
    joinedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

const UserProfile = mongoose.model('UserProfile', userProfileSchema);

module.exports = UserProfile;

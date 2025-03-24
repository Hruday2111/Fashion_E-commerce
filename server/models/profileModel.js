const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userProfileSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    password: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    dateOfBirth: { type: Date },
    gender: { type: String, enum: ['Male', 'Female', 'Other'], default: 'Other' },
    Address: { type: String, default: '' },
    phoneNumber: { type: String, default: '' },
    joinedAt: { type: Date, default: Date.now },
    userId: { type: String }
  },
  { timestamps: true }
);

// Helper function to generate the next sequential userId
async function generateNextUserId() {
  try {
    // Find the profile with the highest existing userId
    const latestProfile = await mongoose.model('UserProfile')
      .findOne()
      .sort({ userId: -1 })
      .select('userId');

    if (latestProfile && latestProfile.userId) {
      const numericPart = parseInt(latestProfile.userId.slice(1), 10); // remove the 'u' prefix
      const nextId = 'u' + String(numericPart + 1).padStart(3, '0');
      console.log(`Generated next userId: ${nextId}`);
      return nextId;
    } else {
      // If no profile exists, start the sequence with u001
      console.log('Starting userId sequence');
      return 'u001';
    }
  } catch (error) {
    console.error(`Error generating next userId: ${error.message}`);
    throw error;
  }
}

// Pre-validate hook to generate userId automatically
userProfileSchema.pre('validate', async function (next) {
  if (this.isNew && !this.userId) {
    try {
      this.userId = await generateNextUserId();
      next();
    } catch (error) {
      next(error);
    }
  } else {
    next();
  }
});

// Pre-save hook for hashing the password if modified
userProfileSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    try {
      const salt = await bcrypt.genSalt(10);
      this.password = await bcrypt.hash(this.password, salt);
    } catch (error) {
      return next(error);
    }
  }
  next();
});

userProfileSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};


const UserProfile = mongoose.model('UserProfile', userProfileSchema);

module.exports = UserProfile;

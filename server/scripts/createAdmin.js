require('dotenv').config();
const mongoose = require('mongoose');
const UserProfile = require('../models/profileModel');

if (!process.env.MONGO_URL) {
  console.error('MONGO_URL is not defined in your .env file.');
  process.exit(1);
}

mongoose.connect(process.env.MONGO_URL)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

async function createAdmin() {
  const existingAdmin = await UserProfile.findOne({ email: 'admin@example.com' });
  if (existingAdmin) {
    // Update existing user with role if it doesn't exist
    if (!existingAdmin.role) {
      existingAdmin.role = 'admin';
      await existingAdmin.save();
      console.log('Updated existing admin user with role');
    } else {
      console.log('Admin user already exists with role');
    }
    mongoose.disconnect();
    return;
  }

  const admin = new UserProfile({
    firstName: 'Admin',
    lastName: 'User',
    email: 'admin@example.com',
    password: 'admin123', // auto-hashed by your schema
    role: 'admin'
  });

  await admin.save();
  console.log('Admin user created');
  mongoose.disconnect();
}

createAdmin(); 
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

async function updateAdminRole() {
  try {
    // Find the admin user
    const adminUser = await UserProfile.findOne({ email: 'admin@example.com' });
    
    if (!adminUser) {
      console.log('Admin user not found. Creating new admin user...');
      const admin = new UserProfile({
        firstName: 'Admin',
        lastName: 'User',
        email: 'admin@example.com',
        password: 'admin123',
        role: 'admin'
      });
      await admin.save();
      console.log('Admin user created with role: admin');
    } else {
      console.log('Found admin user:', adminUser.email);
      console.log('Current role:', adminUser.role);
      
      // Update the role to admin
      adminUser.role = 'admin';
      await adminUser.save();
      console.log('Updated admin user role to: admin');
    }
    
    // Verify the update
    const updatedUser = await UserProfile.findOne({ email: 'admin@example.com' });
    console.log('Verification - User role after update:', updatedUser.role);
    
  } catch (error) {
    console.error('Error updating admin role:', error);
  } finally {
    mongoose.disconnect();
  }
}

updateAdminRole(); 
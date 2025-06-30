const profileModel = require('../models/profileModel');

async function isAdmin(req, res, next) {
  try {
    if (!req.userId) {
      return res.status(401).json({ message: 'Authentication required.' });
    }

    // Fetch user data from database to check role
    const user = await profileModel.findOne({ userId: req.userId });
    
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    if (user.role === 'admin') {
      return next();
    }

    return res.status(403).json({ message: 'Access denied: Admins only.' });
  } catch (error) {
    console.error('Admin middleware error:', error);
    return res.status(500).json({ message: 'Server error.' });
  }
}

module.exports = isAdmin; 
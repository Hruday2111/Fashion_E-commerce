const express = require('express');
const router = express.Router();
const isAdmin = require('../middleware/adminMiddleware');
const { jwtAuthMiddleware } = require('../middleware/jwtmiddleware');

router.get('/dashboard', jwtAuthMiddleware, isAdmin, (req, res) => {
  res.json({ message: 'Welcome to the admin dashboard!' });
});

module.exports = router; 
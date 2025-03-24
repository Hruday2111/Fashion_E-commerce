const express = require('express');
const {jwtAuthMiddleware} = require('../middleware/jwtmiddleware')
const router = express.Router();

const {signup,signin,getProfileById} = require('../controllers/profileController')

router.post('/signup',signup)

router.post('/signin',signin)

router.get('/', jwtAuthMiddleware, getProfileById);

module.exports = router
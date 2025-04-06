const express = require('express');
const {jwtAuthMiddleware} = require('../middleware/jwtmiddleware')
const router = express.Router();

const {signup,signin,getProfileById,signedIn,updateProfileById,logout} = require('../controllers/profileController')

router.post('/signup',signup)

router.post('/signin',signin)

router.get('/check-auth', signedIn )

router.get('/', jwtAuthMiddleware, getProfileById);

router.post('/update' ,jwtAuthMiddleware, updateProfileById);

router.post('/logout',logout)

module.exports = router
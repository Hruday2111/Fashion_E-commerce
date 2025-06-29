const { OAuth2Client } = require('google-auth-library');
const profileModel = require('../models/profileModel');
const { generateToken } = require('../middleware/jwtmiddleware');

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const googleSignIn = async (req, res) => {
  try {
    const { credential } = req.body;

    if (!credential) {
      return res.status(400).json({ message: 'Credential is required' });
    }

    // Verify the Google token
    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { email, given_name, family_name, picture, sub: googleId } = payload;

    // Check if user already exists
    let user = await profileModel.findOne({ email });

    if (!user) {
      // Create new user with Google data
      const userData = {
        firstName: given_name || 'Google',
        lastName: family_name || 'User',
        email: email,
        password: googleId + Date.now(), // Generate a unique password for Google users
        googleId: googleId,
        profilePicture: picture,
        isGoogleUser: true, // Mark as Google user
        joinedAt: new Date(),
      };

      user = new profileModel(userData);
      await user.save();
    } else {
      // Update existing user's Google ID if not present
      if (!user.googleId) {
        user.googleId = googleId;
        user.isGoogleUser = true; // Mark as Google user
        if (picture && !user.profilePicture) {
          user.profilePicture = picture;
        }
        await user.save();
      }
    }

    // Generate JWT token
    const tokenPayload = {
      userId: user.userId,
    };
    const token = generateToken(tokenPayload);

    // Set token as HttpOnly cookie
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 3600000, // 1 hour
    });

    // Return user data (without sensitive information)
    const userResponse = {
      userId: user.userId,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      profilePicture: user.profilePicture,
    };

    res.status(200).json({
      success: true,
      message: 'Google sign-in successful',
      user: userResponse,
    });
  } catch (error) {
    console.error('Google sign-in error:', error);
    res.status(500).json({
      success: false,
      message: 'Google sign-in failed',
      error: error.message,
    });
  }
};

module.exports = { googleSignIn }; 
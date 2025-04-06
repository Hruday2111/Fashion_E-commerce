const jwt = require('jsonwebtoken')

const jwtAuthMiddleware = (req, res, next) => {

  // Extract token from cookies
  const token = req.cookies?.token;

  if (!token) {
    return res.status(401).json({ error: 'Unauthorized: No token provided' });
  }

  try {
    // Verify token using your secret
    const decoded = jwt.verify(token, process.env.JWT_Secret);

    req.userId = decoded.userId; // Attach userId to request
    next();
  } catch (err) {
    console.error('JWT verification error:', err);
    return res.status(401).json({ error: 'Invalid token' });
  }
};

const generateToken = (userData) =>{
    return jwt.sign(userData,process.env.JWT_Secret,{ expiresIn: "1h" });
}

module.exports = {jwtAuthMiddleware,generateToken}
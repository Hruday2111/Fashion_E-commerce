const profileModel = require('../models/profileModel')
const {generateToken} = require('../middleware/jwtmiddleware')
const jwt = require('jsonwebtoken')

const signup = async(req,res) => {
    try{ 
        const {email} = req.body;
        const existingUser = await profileModel.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        const data = req.body;
        const profile = new profileModel(data)

        await profile.save();

        const payload = {
            userId: profile.userId
        }
        const token = generateToken(payload);
        res.status(200).json({message: "User registered successfully", profile: profile,token: token});
    }
    catch(error){
        console.log(error);
        return res.status(500).json({ message: "Server Error", error: error.message });
    }
}

const signin = async (req, res) => {
    console.log("Signin endpoint hit", req.body); // Debug log
    try {
        const { email, password } = req.body;

        // Find the user by email
        const user = await profileModel.findOne({ email });
        if (!user || !(await user.comparePassword(password))) {
            console.log("Invalid email or password"); // Debug log
            return res.status(401).json({ error: 'dudeeeeeee Invalid email or password' });
        }

        // Generate Token
        const payload = { userId: user.userId };
        const token = generateToken(payload);

        // Set token as an HttpOnly cookie
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production', // Use HTTPS in production
            sameSite: 'lax', // Adjust as needed (could be 'strict')
            maxAge: 3600000, // Cookie expires in 1 hour (adjust as needed)
        });

        // Return success response with user info including role
        console.log("Login successful for user:", user.email, "role:", user.role); // Debug log
        res.json({ 
            success: true, 
            userId: user.userId,
            user: {
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                role: user.role
            }
        });
    } catch (err) {
        console.error("Signin error:", err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

const signedIn = async (req, res) => {
    const token = req.cookies?.token;
    if (!token) return res.json({ success: false });
    console.log("Extracted Token:", token); // Log extracted token
  
    try {
        const decoded = jwt.verify(token, process.env.JWT_Secret);
        
        // Fetch full user data from database
        const user = await profileModel.findOne({ userId: decoded.userId });
        if (!user) {
            return res.json({ success: false });
        }
        
        res.json({ 
            success: true, 
            user: {
                userId: user.userId,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                role: user.role
            }
        });
    } catch (err) {
        console.error("JWT Error:", err); // <- this will give you the actual cause
        res.json({ success: false });
    }
};
  
const getProfileById = async (req, res) => {
    try {
        const userId = req.userId;

        const user = await profileModel.findOne({ userId: userId });

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.status(200).json({ user: user });
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

const updateProfileById = async (req, res) => {
    try {
        const userId = req.userId;
        const { oldPassword, newPassword, ...updates } = req.body;

        if (!userId) {
            return res.status(401).json({ error: 'User not authenticated' });
        }

        const user = await profileModel.findOne({ userId });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        
        // Update other fields
        for (const key in updates) {
            if (updates.hasOwnProperty(key)) {
                user[key] = updates[key];
            }
        }
        
        // Handle password change
        if (oldPassword && newPassword) {
            const isPasswordCorrect = await user.comparePassword(oldPassword);
            if (!isPasswordCorrect) {
                return res.status(400).json({ error: 'Old password is incorrect' });
            }

            user.password = newPassword; // triggers pre-save hook
        }

        await user.save(); // Save the updated user

        res.status(200).json({ message: 'Profile updated successfully', user });
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error', details: error.message });
    }
};

const logout = async (req,res) => {
    res.clearCookie("token", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "Lax",
    });
    res.status(200).json({ message: "Logged out successfully" });
}

module.exports = {signup,signin,getProfileById,signedIn,updateProfileById,logout}
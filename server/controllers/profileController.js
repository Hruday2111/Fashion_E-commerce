const profileModel = require('../models/profileModel')
const {generateToken} = require('../middleware/jwtmiddleware')

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
    try {
        const { email, password } = req.body;

        // Find the user by email
        const user = await profileModel.findOne({ email });
        if (!user || !(await user.comparePassword(password))) {
            return res.status(401).json({ error: 'Invalid email or password' });
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

        // Return success response (you might include user info as needed)
        res.json({ success: true, userId: user.userId });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};


const getProfileById = async(req,res) =>{
    try{
        const userId = req.userId
        console.log(userId)
        const user = await profileModel.findOne({userId: userId})
        res.status(200).json({ user :user})
    }
    catch(error){
        console.log(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}
module.exports = {signup,signin,getProfileById}
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

const signin = async(req,res) =>{
    try{
        const {email, password} = req.body;

        // Find the user by email
        const user = await profileModel.findOne({email: email});

        // If user does not exist or password does not match, return error
        if( !user || !(await user.comparePassword(password))){
            return res.status(401).json({error: 'Invalid email or password'});
        }

        // generate Token 
        const payload = {
            userId: user.userId
        }
        const token = generateToken(payload);

        // resturn token as response
        res.json({token})
    }catch(err){
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

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
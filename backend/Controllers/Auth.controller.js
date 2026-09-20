import User from '../Models/User.model.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const signupUser = async (req, res) => {
    try{
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ message: 'Name, email and password are required' });
        }

        const hashPassword = await bcrypt.hash(password,10);

        const newUser = await User.create({ name, email, password: hashPassword });

        const tokenPayload = { id: newUser._id, email: newUser.email, role: newUser.role };
        const accessToken = jwt.sign(
            tokenPayload,
             process.env.JWT_SECRET,
              { expiresIn: '1d' });

        const userResponse = newUser.toObject();
        delete userResponse.password;

        res.status(201).json({ message: 'User created successfully', token: accessToken, user: userResponse });

    }
    catch(error){
        if (error.code === 11000) {
            return res.status(400).json({ message: 'Email is already registered' });
        }
        if (error.name === 'ValidationError') {
            return res.status(400).json({ message: Object.values(error.errors)[0].message });
        }
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

const loginUser = async (req, res) => {

    try{
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required' });
        }

        const user = await User.findOne({ email });
        if(!user){
            return res.status(404).json({message:"User not found "});
        }

        const matchPassword = await bcrypt.compare(password, user.password);
        if (!matchPassword) {
            return res.status(401).json({message: "Invalid email or password "})
        }

        const tokenPayload = { id: user._id, email: user.email, role: user.role };
        const accessToken = jwt.sign(
            tokenPayload,
             process.env.JWT_SECRET,
              { expiresIn: '1d' });

        const userResponse = user.toObject();
        delete userResponse.password;

        res.status(200).json({ message: 'Login successful', token: accessToken, user: userResponse });

    }
    catch(error){
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

export { 
    signupUser, 
    loginUser,
    
}
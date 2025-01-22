const { generateToken } = require('../middlewares/token-middleware');
const User = require('../models/user-model');
const bcrypt = require('bcrypt');

const home = async (req, res) => {
    try {
        res.status(200).send('Auth Page');
    }
    catch (error) {
        console.log(error);
    }
}

const register = async (req, res) => {
    try {
        const { fullname, email, role, idno, password, confirmPassword } = req.body;

        const userExist = await User.findOne({email});
        
        if(userExist)
        {
            return res.status(400).json({message: "User Already Exist"});
        }

        const userCreated = await User.create({ fullname, email, role, idno, password, confirmPassword });
        
        const token = generateToken(userCreated);
         
        res.status(200).json({token, message: "User Registered",});
    }
    catch (error) {
        console.log(error);
        res.status(500).json("Internal Server Error");
    }
}


const login = async (req, res) => {
    try {
        const {role, email, password } = req.body;

        const user = await User.findOne({email});

        if(!user)
        {
            return res.status(400).json({message: "User Not Found"});
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if(!isMatch)
        {
            return res.status(400).json({message: "Invalid Credentials"});
        }

        const token = generateToken(user);
        
        res.status(201).json({token, message: "User logged in",});
    }
    catch (error) {
        console.log(error);
        res.status(500).json("Internal Server Error");
    }
}

module.exports = { home, register, login };
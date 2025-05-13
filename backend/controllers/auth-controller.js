const { generateToken } = require('../middlewares/token-middleware');
const User = require('../models/user-model');
const bcrypt = require('bcryptjs');

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
        if (password !== confirmPassword) {
            return res.status(400).json({ message: "Passwords do not match" });
        }
        const userExist = await User.findOne({ email });
        if (userExist) {
            return res.status(400).json({ message: "User Already Exists" });
        }
        const userCreated = await User.create({ fullname, email, role, idno, password });
        await userCreated.save();
        const token = generateToken(userCreated);
        res.status(201).json({ token, message: "User Registered" });
    } catch (error) {
        console.error("Registration Error:", error);
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};

const login = async (req, res) => {
    try {
        const { role, email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "User Not Found" });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid Credentials" });
        }
        const isType = role.toLowerCase() === user.role.toLowerCase();
        if (!isType) {
            return res.status(403).json({ message: `Access Denied: This email is not registered as ${role}` });
        }
        const token = generateToken(user);
        const { _id, fullname, idno, profileImage  } = user;
        res.status(200).json({
            message: "User logged in",
            token,
            user: {
                id: _id,
                fullname,
                email,
                role: user.role,
                idno,
                profileImage: profileImage || '', 
            }
        });
    } catch (error) {
        console.error("Login Error:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

const updateProfileImage = async (req, res) => {
    try {
      const { profileImage } = req.body;
      if (!req.user || !req.user.id) {
        return res.status(401).json({ message: "Unauthorized: No user found in request" });
      }
      const user = await User.findById(req.user.id);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      user.profileImage = profileImage;
      await user.save();
      res.status(200).json({ message: "Profile image updated", profileImage: user.profileImage });
    } catch (error) {
      console.error("Profile Image Update Error:", error);
      res.status(500).json({ message: "Server error", error: error.message });
    }
  };

const getProfile = async (req, res) => {
    try {
        console.log("Received User from Middleware:", req.user);
        if (!req.user || !req.user.id) {
            return res.status(401).json({ message: "Unauthorized: No user found in request" });
        }
        const user = await User.findById(req.user.id).select("-password");
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.json(user);
    } catch (error) {
        console.error("Profile Fetch Error:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

module.exports = { home, register, login ,getProfile,updateProfileImage};
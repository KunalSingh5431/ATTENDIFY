const jwt = require("jsonwebtoken");
const SECRET_KEY = process.env.JWT_SECRET_KEY ;
const authToken = (req, res, next) => {
    const token = req.headers["authorization"]?.split(" ")[1];
    if (!token) {
        return res.status(401).json({ message: "Access Denied: No token provided" });
    }
    try {
        const verified = jwt.verify(token, SECRET_KEY);
        req.user = verified; 
        console.log("Decoded User from Token:", req.user); 
        if (!req.user.id) {
            return res.status(401).json({ message: "Unauthorized: Token does not contain user ID" });
        }
        next();
    } catch (error) {
        console.error("Token Verification Error:", error);
        res.status(403).json({ message: "Invalid or Expired Token" });
    }
};

const generateToken = (user) => {
    return jwt.sign(
        {
            id: user._id, 
            username: user.username,
        },
        SECRET_KEY,
        { expiresIn: "1h" }
    );
};

module.exports = { authToken, generateToken };

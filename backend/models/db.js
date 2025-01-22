const mongoose = require("mongoose");

const URI = process.env.MONGODB_URI;

const connectDB = async () => {
    try {
        await mongoose.connect(URI);
        console.log("DB Connected");
    }
    catch (error) {
        console.log("DB Connection Error");
        process.exit(0);
    }
};

module.exports = connectDB;
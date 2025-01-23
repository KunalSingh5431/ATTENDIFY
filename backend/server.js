require('dotenv').config();
const express=require("express");
const cors=require('cors');
const bodyParser=require('body-parser');
const authRouter = require('./routes/auth-router');
const connectDB = require("./models/db");

const port = 8000; 

const app =express();

app.use(cors());
app.use(bodyParser.json());
app.use(express.json());

app.use("/auth", authRouter);

app.get("/", (req, res) => {
    res.send("I am Root");
})

connectDB().then(() => {
app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
})
});

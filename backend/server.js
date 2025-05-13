require('dotenv').config();
const express=require("express");
const cors=require('cors');
const bodyParser=require('body-parser');
const authRouter = require('./routes/auth-router');
const connectDB = require("./models/db");
const uploadRoutes=require("./routes/upload");

const port = process.env.PORT || 8000;

const app =express();

app.use(cors());
app.use(bodyParser.json({ limit: '30mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));
app.use(express.json());

app.use("/auth", authRouter);
app.use('/api', uploadRoutes);

app.get("/", (req, res) => {
    res.send("I am Root");
})

connectDB().then(() => {
app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
})
});

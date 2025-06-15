require('dotenv').config();
const express = require("express");
const cors = require('cors');
const bodyParser = require('body-parser');
const connectDB = require("./models/db");
const mongoose = require('mongoose');

const authRouter = require('./routes/auth-router');
const uploadRoutes = require("./routes/upload");
const attendanceRoutes = require('./routes/attendanceRoutes');

const port = process.env.PORT || 8000;

const app = express();

app.use(cors());
app.use(bodyParser.json({ limit: '30mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));
app.use(express.json());

app.use("/auth", authRouter);
app.use('/api', uploadRoutes);
app.use('/api/attendance', attendanceRoutes);

app.get("/", (req, res) => {
  res.send("I am Root");
});

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('✅ MongoDB connected');
}).catch(err => console.error(err));

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

const express = require("express");
const dotenv=require('dotenv');
const cors=require('cors');
const bodyParser=require('body-parser');
const port = 8000;

dotenv.config();

const app =express();

app.use(cors());
app.use(bodyParser.json());


app.get("/", (req, res) => {
    res.send("I am Root");
})

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});
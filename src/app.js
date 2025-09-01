require("dotenv").config();
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const authRoute = require("./routes/auth.route")

const app = express();

app.use(cors());
app.use(express.json());
app.use(cookieParser());


app.get("/", (req, res)=>{
    res.send("Hello World")
})


app.use("/api/auth", authRoute )



module.exports = app
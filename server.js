const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser")
const mongoose = require('mongoose');
require("dotenv").config(); // import the dotenv library for .env file
const authRoutes = require("./Routes/AuthRoutes") // middleware
const app = express(); // require dependencies

const mongo = process.env.MONGO_CONNECT;

// start server on port 8080
app.listen(8080, ()=>{
    console.log("API listening on PORT 8080");
});

// connect to mongoDB
mongoose.connect(mongo,{
}).then(()=>{
    console.log("DB Connection Successfull")
}).catch((err)=>{
    console.log(err.message)
})

// lets us call the server like an API if its a GET or POST method from http://localhost:3000
app.use(cors({
    origin:["https://web-final-client-4b55.vercel.app"], // change depending on where hosting front end
    methods:["GET","POST"],
    credentials: true
}));

app.use(cookieParser()); // use depenencies
app.use(express.json());
app.use("/",authRoutes) // if a request is made to http://localhost:8080 run ./Routes/AuthRoutes
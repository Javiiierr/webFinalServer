const UserModel = require("../Models/UserModel");  // model of a user in the database
const jwt = require('jsonwebtoken'); // dependancy
require("dotenv").config(); // import the dotenv library for .env file

const jwtSecret = process.env.JWT_SECRET;
const maxAge = 3*24*60*60 // token will last 3 days before naturally expiring

// create a token using the mongoID of the user along with the secret key
const createToken = (id) => {
    return jwt.sign({id}, jwtSecret, {
        expiresIn: maxAge
    }); 
}

// called in register and login functions
const handleErrors = (err) => {
    let errors = {userName: "", password: ""};

    if(err.message === "Incorrect Username") errors.userName = "That username is not registered" // set error message to the proper error, gets called in front end via alert
    if(err.message === "Incorrect Password") errors.userName = "That password is incorrect" // set error message to the proper error, gets called in front end via alert

    if(err.code===11000) { // mongo error code if username is alreaady in database
        errors.userName = "Username is already registered";
        return errors; // gets called in front end via alert
    }

    if(err.message.includes("Users validation failed")) { // this error is provided by mongo when the user input doesnt match the schema (missing username/password)
        Object.values(err.errors).forEach(({properties}) => { // collect all the error messages and assign it to the error object
            errors[properties.path] = properties.message
        })
    }
    return errors // gets called in front end via alert
}

// called by signup in front end via API call
module.exports.register = async(req, res, next) => {
try {
    console.log("REGISTER")
    const user = await UserModel.create({ userName: req.body.username, password: req.body.password }); // creates user
    const token = createToken(user._id); // creates jwt token using mongoID
    res.cookie("jwt", token, {
        domain: 'localhost', // Set the domain to 'localhost'
        withCredentials: true,
        httpOnly: false,
        maxAge: maxAge*1000
    })
    res.status(201).json({user:user._id,created:true}) // successfully made user

} catch(err) {
    console.log("ERR")
    const errors = handleErrors(err); // errors if missing username/password or username is taken
    res.json({errors, created:false})
}};

// called by login in front end via API call
module.exports.login = async(req, res, next) => {
    try {
        console.log("LOGI")
        const { username, password } = req.body; // destructure req.body
        console.log(username)
        const user = await UserModel.login(username, password); // call login function in Models/UserModel
        console.log(user)
        const token = createToken(user._id); // creates jet token with mongo ID
        res.cookie("jwt", token, {
            domain: 'localhost', // Set the domain to 'localhost'
            withCredentials: true,
            httpOnly: false,
            maxAge: maxAge*1000
        })
        res.status(200).json({user:user._id,created:true}) // successfully found user
    
    } catch(err) {
        console.log("ERR")
        const errors = handleErrors(err); // errors if username is not registered or password doesnt match
        res.json({errors, created:false})
    }
};
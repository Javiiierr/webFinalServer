const User = require("../Models/UserModel") // model of a user in the database
const jwt = require("jsonwebtoken") // dependencies
require("dotenv").config(); // import the dotenv library for .env file

const jwtSecret = process.env.JWT_SECRET;

module.exports.checkuser = (req, res, next) => {
    const token = req.cookies.jwt; // get the jwt cookie
    console.log("CHECK")
    if (token) {
        console.log("TOKEN")
        jwt.verify(token, jwtSecret, async (err, decodedToken) => { // verify the token 
            if (err) { // send error if not a match
                console.log("NO MATCH")
                res.json({status: false})
                next()
            } else { // if it matched
                console.log("MATCH")
                const user = await User.findById(decodedToken.id) // find user in database
                if (user) res.json({status:true, user:user.userName}) // if found then send status true and username
                else res.json({status: false}) // if not found send status false for errors
                next()
            }
        })
    } else {
        console.log("ERR")
        res.json({status: false}) // if no token send status false for errors 
        next()
    }
}
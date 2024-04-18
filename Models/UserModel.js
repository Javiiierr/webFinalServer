const mongoose = require('mongoose');
const bcrypt = require("bcrypt"); // dependancies

// js representation of the user in the database
let userSchema = new mongoose.Schema({
  userName: {
    type: String,
    required:[true,"Username is Required"], // error message if suername is not given
    unique: true
  },
  password: {
    type: String,
    required:[true,"Password is Required"], // error message if password is not given
  }
});

// called before a user is added to the database, it is called automatically
userSchema.pre("save", async function(next) {
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password, salt) // encrypt the password
    next()
})

// called in AuthConrollers login
userSchema.statics.login = async function(userName, password) {
    const user = await this.findOne({userName}) // find the user in the database
    if (user) {
        const auth = await bcrypt.compare(password, user.password) // if passwords match
        if(auth) {
            return user; // return user
        }
        throw Error("Incorrect Password") // passwords didn't match
    }
    throw Error("Incorrect Username") // no user found
}

module.exports = mongoose.model("Users", userSchema)
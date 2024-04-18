const { register, login } = require("../Controllers/AuthControllers"); // middleware for register and login routes
const { checkuser } = require("../Middlewares/Auth"); // middleware for / route
const router = require("express").Router(); // dependency

router.get("/", (req, res) => {
    res.send("Hello from API");
  });
router.post("/", checkuser) // favourites and viewCart call this route
router.post("/register",register) // signUp calls this route
router.post("/login",login) // login calls this route

module.exports = router;
const express = require("express");
const { login, signup } = require("../controller/auth_controller");
const authRoute = express.Router();

//$ ====== Login ======
authRoute.post("/login", login);
//$ ====== SignUp ======
authRoute.post("/signup", signup);

module.exports = authRoute;

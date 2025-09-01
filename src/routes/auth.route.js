const express = require("express");
const authcontrollers = require("../controllers/auth.controller")

const router = express.Router();


router.post("/register", authcontrollers.register)
router.post("/login", authcontrollers.login)
router.post("/logout", authcontrollers.logout)

module.exports = router

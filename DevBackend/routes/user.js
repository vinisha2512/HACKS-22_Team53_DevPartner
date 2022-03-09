const express = require("express");
const router = express.Router();

var userController = require("../Controllers/userController");

router.post('/login', userController.login);
router.post('/signup', userController.signup);

module.exports = router;
const express = require("express");
const router = express.Router();

var fetchController = require("../Controllers/fetchController");

router.get('/fetchUsers', fetchController.fetchUsers);

module.exports = router;
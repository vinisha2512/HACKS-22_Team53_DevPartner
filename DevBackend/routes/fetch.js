const express = require("express");
const router = express.Router();

var fetchController = require("../Controllers/fetchController");

router.get('/fetchUsers', fetchController.fetchUsers);
router.get('/fetchProjs', fetchController.fetchProjs);

module.exports = router;
const express = require("express");
const router = express.Router();

var chatController = require("../Controllers/chatController");

router.post('/messages', chatController.savemsg);
router.post('/getmessages', chatController.getmsg);
router.post('/getuserpro', chatController.profile);
router.post('/projectdeets', chatController.getprojs);
// router.get('/message/:user', chatController.getmsg);
module.exports = router;


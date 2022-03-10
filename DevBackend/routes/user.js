const express = require("express");
const router = express.Router();

var multer = require("multer");

var storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, "uploads");
    },
    filename: (req, file, cb) => {
      cb(null, req.body.filename);
    },
  });
  
  var upload = multer({ storage: storage });

var userController = require("../Controllers/userController");

router.post(
    "/signup",
    upload.single("image"),
    userController.signup
  );

router.post('/login', userController.login);
router.get('/test_auth', userController.test);

module.exports = router;
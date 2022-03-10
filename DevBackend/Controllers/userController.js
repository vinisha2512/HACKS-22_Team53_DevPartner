const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");

var fs = require("fs");
var path = require("path");
const { request } = require("http");  

exports.signup = (req, res, next) => {
  // console.log(req.body)
  User.find({ email: req.body.email })
    .exec()
    .then(user => {
      if (user.length >= 1) {
        return res.status(409).json({
          message: "Mail exists"
        });
      } else {
        bcrypt.hash(req.body.password, 10, (err, hash) => {
          if (err) {
            return res.status(500).json({
              error: err
            });
          } else {
            const user = new User({
              _id: new mongoose.Types.ObjectId(),
              email: req.body.email,
              password: hash,
              age: req.body.age,
              name: req.body.name,
              phoneNo: req.body.phoneNo,
              resume: {
                Name: req.body.filename,
                pdf: {
                  data: fs.readFileSync(
                    path.join(__dirname, "../" + "uploads" + "/" + req.body.filename)
                  ),
                  contentType: "application/pdf",
                },
              },
              bio: req.body.bio,
              gender: req.body.gender,
              gitlink: req.body.gitlink,
              link: req.body.link
            });
            user
              .save()
              .then(result => {
                const token = jwt.sign(
                  {
                    email: result.email,
                    userId: result._id
                  },
                  process.env.JWT_KEY,
                  {
                    expiresIn: "1h"
                  }
                );
                res.status(201).json({
                  message: "User created",
                  token: token
                });
              })
              .catch(err => {
                console.log(err);
                res.status(500).json({
                  error: err
                });
              });
          }
        });
      }
    });
}

exports.login = (req, res, next) => {
  User.find({ email: req.body.email }).exec().then(user => {
    //Not registered
    if (user.length < 1) {
      return res.status(401).json({
        message: "No such user"
      });
    }
    bcrypt.compare(req.body.password, user[0].password, (err, result) => {
      //Handle Error
      if (err) {
        return res.status(401).json({
          message: "Something Went Wrong"
        });
      }
      //password matches
      if (result) {
        const token = jwt.sign(
          {
            email: user[0].email,
            userId: user[0]._id
          },
          process.env.JWT_KEY,
          {
            expiresIn: "1h"
          }
        );
        
        return res.status(200).json({
          message: "Auth successful",
          token: token
        });
      }
      //password does not match
      return res.status(401).json({
        message: "Invalid credential"
      });
    });
  })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
}

exports.otp = async (req, res) => {
  let email = req.body.email;
  let number = req.body.number;
  let otp = generateOTP();

  console.log(email);
  console.log(number);
  res.send(otp);

  var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'eat.project.314@gmail.com',
      pass: 'smdoxbzevzhuyiww'
    }
  });

  var mailOptions = {
    from: 'eat.project.314@gmail.com',
    to: email,
    subject: 'Verify contact details',
    text: 'To verify your contact details, kindly submit the given otp.OTP:' + otp
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });

  var unirest = require("unirest");

  var sms_req = unirest("GET", "https://www.fast2sms.com/dev/bulkV2");

  sms_req.query({
    "authorization": "xsLCk2M1lK5hHGY9IzaToBOuDAW0cgnpPfRSUEF7mXQ4jNwqtr2NQiJm7YZzWjSxehu8goTIsO3L4AH9",
    "sender_id": "TXT_GPS",
    "message": "This is a test message",
    "route": "v3",
    "numbers": number
  });

  sms_req.headers({
    "cache-control": "no-cache"
  });


  sms_req.end(function (result) {
    if (result.error) throw new Error(result.error);

    console.log(res.body);
  });
};

function generateOTP() {
  // Declare a digits variable which stores all digits
  var digits = '0123456789';
  let OTP = '';
  for (let i = 0; i < 6; i++) {
    OTP += digits[Math.floor(Math.random() * 10)];
  }
  return OTP;
}

// test authentication
exports.test = (req, res) => {
  cookies = req.headers.authorization.slice(7,)
  console.log(cookies)
  cook = cookies.split("; ");
  const substring = "authtoken=";

  const match = cook.find((element) => {
    if (element.includes(substring)) {
      return element;
    }
  });
  var dec;
  if (match) {
    dec = jwt.decode(match.slice(10));
  }

  if (dec) {
    res.status(200).json({
      message: "Auth successful",
    });
  } else {
    res.status(401).json({
      message: "Log in please",
    });
  }
};
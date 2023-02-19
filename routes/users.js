var express = require('express');
const bodyParser = require("body-parser");
var router = express.Router();
const passport = require("passport");
const User = require("../Model/user");
const cors = require("./cors");
const authenticate = require("../authenticate");


router.use(bodyParser.json());
router.options(cors.corsWithOption, (req, res) => { res.sendStatus(200); })
/* GET users listing. */
router.get('/', (req, res, next) => {
  User.find()
  .then(user => {
    res.statusCode = 200;
    res.setHeader("Content-Type", "application/json");
    res.json(user)
  })
})

router.post("/signup", cors.corsWithOption, (req, res) => {
  User.register(new User({username: req.body.username}), req.body.password, (err, user) => {
    if (err) {
      res.statusCode = 404;
      res.setHeader("Content-Type", "application/json");
      res.json({err: err})
    } else {
      if (req.body.admin) {
        user.admin = true;
      }
      if (req.body.email) {
        user.email = req.body.email;
      }
      if (req.body.fullname) {
        user.fullname = req.body.fullname;
      }
      user.save((err, user) => {
        if (err) {
          res.statusCode = 500;
          res.setHeader("Content-Type", "application/json");
          res.json({err: err});
          return ;
        }

        passport.authenticate("local")(req, res, () => {
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json({success: true, status: "Registration successful"});
        });
      })
    }
  })
})


router.post("/signin", cors.corsWithOption,  (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) { return next(err);}
    if (!user) {
      res.statusCode = 401;
      res.setHeader("Content-Type", "application/json");
      res.json({success: false, status: "signin not successful", err: info})
    }
    req.logIn(user, (err) => {
      if (err) {
        return res.statusCode = 401;
        return res.setHeader("Content-Type", "application/json");
        return res.json({succes: false, status: "Login unsuccesful", err: "User could not be logged in successfully."})
        return ;
      }

      var token = authenticate.getToken({_id: req.user._id});
      res.statusCode = 200;
      res.setHeader("Content-Type", "application/json");
      res.json({success: true, status: "sign in successful", token: token, userId: req.user._id})
    });
  }) (req, res, next)
})

router.post("/logout", (req, res, next) => {
  req.logOut((err) => {
    if (err) { return next(err) }
    res.json({status: "https://coral-fish-vest.cyclic.app/"})
  })
})


router.get("/user", cors.corsWithOption, authenticate.verifyUser, (req, res, next) => {
  User.findOne({_id: req.user._id})
  .then((user) => {
    res.statusCode = 200;
    res.setHeader("Content-Type", "application/json");
    res.json(user)
  }, (err) => next(err)).catch(err => next(err)); 
})

router.route("/:userDetails") 
.get(cors.corsWithOption, authenticate.verifyUser, (req, res, next) => {
  User.findOne({_id: req.user._id})
  .then(resp => {
    if (resp.fullname !== req.params.userDetails) {
      User.find({fullname: req.params.userDetails})
      .then((user) => {
          if (!user) {
              res.statusCode = 404;
              res.setHeader("Content-Type", "application/json");
              res.json({success: false, status: "User not found"})
          } else {
              res.statusCode = 200;
              res.setHeader("Content-Type", "application/json");
              res.json({success: true, status: user})
          }
      })
    } else {
      res.statusCode = 401;
      res.setHeader("Content-Type", "application/json");
      res.json({success: false, status: "You can't send request to yourself!!! send request to another person."})
    }
  })
})

router.get("/auth/github/login", cors.corsWithOption, passport.authenticate("github"), (req, res) => {
  var token = authenticate.getToken({_id: req.user._id});
  res.statusCode = 200;
  res.setHeader("Content-Type", "application/json");
  res.json({success: true, message: "Login successful", token: token});
})

router.get("/auth/github/callback", cors.cors, passport.authenticate('github'),
  function(req, res) {
    var token = authenticate.getToken({_id: req.user._id});
    res.statusCode = 200;
    res.setHeader("Content-Type", "application/json");
    res.json({success: true, message: "Loging in with github is successful", token: token});
    res.redirect('http://localhost:3001/dashboard');
    return ;
})

module.exports = router;

var express = require('express');
const bodyParser = require("body-parser");
var router = express.Router();
const passport = require("passport");
const User = require("../Model/user");
const cors = require("./cors");
const authenticate = require("../authenticate");
const userDetails = require("../Model/userDetails");
const config = "../config";


router.use(bodyParser.json());
router.options(cors.corsWithOption, (req, res) => { res.sendStatus(200); })
/* GET users listing. */
router.get('/', cors.cors, (req, res, next) => {
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
    res.json({status: "https://challengedeveloper.vercel.app/"}) // "https://challenge-umber-six.vercel.app/"
  })
})


router.get("/user", cors.cors, authenticate.verifyUser, (req, res, next) => {
  User.findOne({_id: req.user._id})
  .then((user) => {
    res.statusCode = 200;
    res.setHeader("Content-Type", "application/json");
    res.json(user)
  }, (err) => next(err)).catch(err => next(err)); 
})

router.route("/:userDetails") 
.get(cors.cors, authenticate.verifyUser, (req, res, next) => {
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

router.get("/auth/github/login", cors.cors, passport.authenticate("github"), async (req, res) => {
  console.log(req.query.code)

  const params = "?client_id=" + config.github.clientId + "&client_secret=" + config.github.clientSecret + "&code=" + req.query.code;

  await fetch("https://github.com/login/oauth/access_token" + params, {
    method: "POST",
    headers: {
      accept: 'application/json'
    }
  }).then(resp => resp.json())
  .then(resp => {
    console.log(resp);
    res.statusCode = 200;
    res.setHeader("Content-Type", "application/json");
    res.json({success: true, status: 'log in successful'})
  })
})

// getuserdata

router.get('/getUserData', cors.cors, async (req, res) => {
  console.log(req.get("Authorization"))
  await fetch("GET https://api.github.com/user", {
    headers: {
      "Authorization": req.get('Authorization')
    }
  })
  .then(resp => resp.json())
  .then(resp => {
    console.log(resp)
    res.json({data: resp, succcess: true})
  }).catch(err => console.log(err));
})

/* router.get("/auth/github/callback", cors.cors, passport.authenticate('github'),
  function(req, res) {
    userDetails.find({"userId": req.user._id})
    .then(resp => {
      if (resp.length === 0) {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.redirect('http://localhost:3001/');
        return ;
      } else {
        var token = authenticate.getToken({_id: req.user._id});
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json({success: true, status: "Logging in with github is successful", token: token, userId: req.user._id});
        res.redirect('http://localhost:3001/dashboard');
        return ;
      }
    }).catch(err => console.log(err))
}) */


module.exports = router;

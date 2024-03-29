require("dotenv").config()
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const passport = require("passport");
const mongoose = require("mongoose");
const session = require("express-session");
const cors = require("./routes/cors")

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var uploadRouter = require("./routes/upload");
var requestRouter = require("./routes/request");
var acceptRouter = require("./routes/accept");
var githubRouter = require("./routes/userGithubInfoRouter");
var repoRouter = require("./routes/repo")

var app = express();
app.options(cors.cors, (req, res) => res.sendStatus(200));

/* app.all("*", cors.cors, (req, res, next) => {
  if (req.secure) {
    return next();
  } else {
    res.redirect(307, "https://" + req.hostname + ":" + process.env.PORT + req.url)
  }
}) */
mongoose.connect(process.env.MONGODB_URL, { useUnifiedTopology: true, useNewUrlParser: true  })
.then((db) => {
  console.log("Connection to the database is established...")
},(err) => console.log(err)).catch((err) => console.log(err));

app.use(cors.cors);
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser(process.env.SECRET_KEY));
app.use(session({
  name: "session_id",
  saveUninitialized: false,
  resave: false,
  secret: process.env.SECRET_KEY,
}))
app.use(passport.initialize());
app.use(passport.session());

app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use("/upload", uploadRouter);
app.use("/request", requestRouter);
app.use("/accept", acceptRouter);
app.use("/github", githubRouter);
app.use("/repo", repoRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});
module.exports = app;

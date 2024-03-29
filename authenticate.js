require("dotenv").config()
const GithubStrategy = require("passport-github").Strategy
const passport = require('passport');
const localStrategy =  require("passport-local").Strategy;
const jwtExtract = require("passport-jwt").ExtractJwt;
const jwtStrategy = require("passport-jwt").Strategy;
const jwt = require("jsonwebtoken");
const User = require("./Model/user");
const config = require("./config")

passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

exports.getToken = function(user) {
    return jwt.sign(user, process.env.SECRET_KEY, {expiresIn: '1h'});
}

const opt = {}
opt.jwtFromRequest = jwtExtract.fromAuthHeaderAsBearerToken();
opt.secretOrKey = process.env.SECRET_KEY

exports.jwtPassport = passport.use(new jwtStrategy(opt, (jwt_payload, done) => {
    console.log("jwt_payload", jwt_payload);

    User.findOne({_id: jwt_payload._id}, (err, user) => {
        if (err) {
            return done(err, false);
        } else if (user) {
            return done(null, user);
        } else {
            return done(null, false);
        }
    })
}))

exports.verifyUser = passport.authenticate("jwt", {session: "false"});


/* exports.githubauth = passport.use(new GithubStrategy({
    clientID: config.github.clientId,
    clientSecret: config.github.clientSecret,
    callbackURL: "http://localhost:3000/users/auth/github/callback"
}, function(accessToken, refreshToken, profile, done) {
    console.log(profile)
    User.findOne({githubId: profile.id}, (err, user) => {
        if (err) {
            return done(err, false);
        } else if (!err && user !== null) {
            return done(null, user);
        } else {
            user = new User({username: profile.username});
            var name = profile.displayName;
            user.fullname = name;
            user.githubId = profile.id;
            user.save((err, user) => {
                if (err) {
                    return done(err, false)
                } else {
                    return done(null, user);
                }
            })
        }
    })
}
)) */

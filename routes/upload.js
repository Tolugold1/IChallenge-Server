const express = require("express");
const multer = require("multer");
const bodyParser = require("body-parser");
const authenticate = require("../authenticate")
const cors = require("./cors");
const UserDetails = require("../Model/userDetails")
const fs = require("fs");
const User = require("../Model/user");

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "public/images");
    },

    filename: (req, file, cb) => {
        cb(null, file.originalname)
    }
});

const imageFileFilter = (req, file, cb) => {
    if (!file.originalname.match(/\.(jpg|jpeg|gif|png)$/)) {
        cb(new Error("Invalid file name. The file must be of the format jpg, jpeg, png or git", false))
    } else {
        cb(null, true);
    }
};

const upload = multer({storage: storage, fileFilter: imageFileFilter});

const uploadPics = express();
uploadPics.use(bodyParser.json());

uploadPics.route("/")
.options(cors.corsWithOption, (req, res) => {res.sendStatus(200)})
.get( cors.cors, authenticate.verifyUser, (req, res, next) => {
    UserDetails.find({userId: req.user._id})
    .then((details) => {
        if (details.length > 0) {
            console.log(details.length)
            res.statusCode = 200;
            res.setHeader("Content-Type", "application/json");
            res.json({success: true, status: details})
        } else {
            res.statusCode = 404;
            res.setHeader("Content-Type", "application/json")
            res.json({success: false, status: "User not found"})
        }
    },(err) => next(err)).catch(err => next(err));
})

.post( cors.corsWithOption, authenticate.verifyUser, upload.single('pics'), (req, res, next) => {
    UserDetails.findOne({userId: req.user._id})
    .then(resp => {
        if (!resp) {
            if (req.file === null) {
                err = new Error("File not selected");
                err.status = 404;
                next(err);
            } else {
                //red the image from the path after it has been uploaded to the server.
                var filepath = fs.readFileSync(req.file.path)
                var pics = filepath.toString('base64');
                //define the data to upload
                var obj = {
                    userId: req.user._id,
                    fullname: req.body.fullname,
                    twittername: req.body.twittername,
                    githubname: req.body.githubname,
                    facebookname: req.body.facebookname,
                    pics: {
                        data: filepath,
                        contentType: req.file.mimetype
                    }
                }
                UserDetails.create(obj)
                .then((resp) => {
                    res.statusCode = 200;
                    res.setHeader("Content-Type", "application/json");
                    res.json({success: true, status: resp})
                })
            }
        } else {
            res.statusCode = 401;
            res.setHeader("Content-Type", "application/json");
            res.json({success: true, status: "user already exit"})
        }
    })
})

.put(cors.corsWithOption, authenticate.verifyUser, (req, res, next) => {
    console.log(req.body.day_number)
    console.log(req.body.reponame)
    UserDetails.findOneAndUpdate({userId: req.user._id}, {$set: {
        number_of_challenge_days: req.body.day_number, github_repo_name: req.body.reponame
    }}, {new: true})
    .then(resp => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(resp);
    })
})

.delete((req, res) => {
    res.statusCode = 403;
    res.end("not supported")
})

uploadPics.route("/:userDetails")
.options(cors.corsWithOption, (req, res) => {res.sendStatus(200);})
.get(cors.cors, (req, res, next) => {
    UserDetails.find({userId: req.params.userDetails})
    .then((user) => {
        if (user.length < 1) {
            res.statusCode = 404;
            res.setHeader("Content-Type", "application/json");
            res.json({success: false, status: "User not found"})
        } else {
            res.statusCode = 200;
            res.setHeader("Content-Type", "application/json");
            res.json({success: true, status: user})
        }
    })
})

module.exports = uploadPics;
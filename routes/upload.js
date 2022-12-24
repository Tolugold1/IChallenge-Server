const express = require("express");
const multer = require("multer");
const bodyParser = require("body-parser");
const authenticate = require("../authenticate")
const cors = require("./cors");
const UserDetails = require("../Model/userDetails")
const fs = require("fs");
const path = require("path");

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
    UserDetails.findById({_id: req.user._id})
    .then((details) => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(details)
    },(err) => next(err)).catch(err => next(err));
})

.post( cors.corsWithOption, upload.single('pics'), (req, res) => {
    res.statusCode = 200;
    res.setHeader("Content-Type", "application/json");
    res.json({success: true, status: req.file});
})

.put((req, res) => {
    res.statusCode = 403;
    res.end("not supported")
})

.delete((req, res) => {
    res.statusCode = 403;
    res.end("not supported")
})

module.exports = uploadPics;
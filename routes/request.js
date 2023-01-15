var express = require('express');
const bodyParser = require("body-parser");
var requestRouter = express.Router();
const Request = require("../Model/request");
const cors = require("./cors");
const authenticate = require("../authenticate");

requestRouter.use(bodyParser.json());
requestRouter.route("/")
.get(cors.cors, (req, res, next) => {
    Request.find({})
    .then((resp) => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(resp);
    })
})

.post(cors.corsWithOption, authenticate.verifyUser, (req, res, next) => {
    var obj = {
        peerUserId: req.body.peerId
    }
    Request.create(obj)
    .then((resp) => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(resp)
    })
})

module.exports = requestRouter;
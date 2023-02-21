var express = require('express');
const bodyParser = require("body-parser");
var acceptRouter = express.Router();
const cors = require("./cors");
const authenticate = require("../authenticate");
const Accept = require('../Model/accept');

acceptRouter.use(bodyParser.json());
acceptRouter.route("/")
.options(cors.corsWithOption, (req, res) => { res.sendStatus(200);})
.get(cors.cors, authenticate.verifyUser, (req, res, next) => {
    Accept.findOne({myAcct: req.user._id})
    .then(resp => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json({success: true, status: resp});
    })
})

.post(cors.corsWithOption, authenticate.verifyUser, (req, res, next) => {
    Accept.findOne({myAcct: req.user._id})
    .then(resp => {
        if (resp === null) {
            var obj = {
                myAcct: req.user._id
            }
            Accept.create(obj)
            .then(resp => {
                res.statusCode = 200;
                res.setHeader("Content-Type", "application/json")
                res.json(resp)
            })
        } else {
            err = new Error("Already have an acct there");
            err.status = 404;
            next(err)
        }
    }).catch(err => next(err))
})

.put(cors.corsWithOption, (req, res, next) => {
    res.statusCode = 401;
    res.end("Not supported")
})

/* .delete(cors.corsWithOption, authenticate.verifyUser, (req, res, next) => {
    Accept.findByIdAndDelete({sender: req.user._id})
    .then(resp => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json")
        res.json("Successfully deleted")
    })
}) */

acceptRouter.route("/:acceptId")
.options(cors.corsWithOption, (req, res, next) => {res.sendStatus(200);})
.get(cors.cors, authenticate.verifyUser, (req, res, next) => {
    Accept.findOne({myAcct: req.params.acceptId})
    .then(resp => {
        if (resp !== null) {
            const acceptStatus = resp.Acceptedrequest.indexOf((req.user._id))
            if (acceptStatus !== -1) {
                res.statusCode = 200;
                res.setHeader("Content-Type", "application/json");
                res.json({success: true, status: {id: req.params.acceptId, stat: "Accepted"}})
            } else {
                res.statusCode = 401;
                res.setHeader("Content-Type", "application/json");
                res.json({success: false, status: {id: req.params.acceptId, stat: "pending"}})
            }
        }
    }, (err) => next(err)).catch(err => next(err));
})

.post(cors.corsWithOption, authenticate.verifyUser, (req, res, next) => {
    Accept.findOne({myAcct: req.user._id})
    .then(resp => {
        const idx = resp.Acceptedrequest.indexOf(req.params.acceptId)
        if (idx === -1 && resp.Acceptedrequest.length === 0) {
            resp.Acceptedrequest.push(req.params.acceptId)
            resp.save()
            .then(resp => {
                res.statusCode = 200;
                res.setHeader("Content-Type", "application/json");
                res.json({success: true, status: resp})
            })
        } else {
            res.statusCode = 401;
            res.setHeader("Content-Type", "application/json");
            res.json({success: true, status: "You have already accepted another person request."})
        }
    }, (err) => next(err)).catch(err => next(err));
})

module.exports = acceptRouter;
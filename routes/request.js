var express = require('express');
const bodyParser = require("body-parser");
var requestRouter = express.Router();
const Request = require("../Model/request");
const cors = require("./cors");
const authenticate = require("./authenticate");

requestRouter.use(bodyParser.json());
requestRouter.route("/")
.options(cors.corsWithOption, (req, res) => { res.sendStatus(200);})
.get(cors.cors, authenticate.verifyUser, (req, res, next) => {
    Request.findOne({myAcct: req.user._id})
    .populate("requestSenderId")
    .populate("requestISend")
    .then(resp => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json({success: true, status: resp});
    })
})

.post(cors.corsWithOption, authenticate.verifyUser, (req, res, next) => {
    Request.findOne({myAcct: req.user._id})
    .then(resp => {
        if (resp === null) {
            var obj = {
                myAcct: req.user._id
            }
            Request.create(obj)
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
    })
})

.put(cors.corsWithOption, (req, res, next) => {
    res.statusCode = 401;
    res.end("Not supported")
})

.delete(cors.corsWithOption, authenticate.verifyUser, (req, res, next) => {
    Request.findByIdAndDelete({sender: req.user._id})
    .then(resp => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json")
        res.json("Successfully deleted")
    })
})

requestRouter.route("/:requestId")
.options(cors.corsWithOption, (req, res, next) => {res.sendStatus(200);})
/* .get(cors.cors, authenticate.verifyUser, (req, res, next) => {
    Request.findOne({myAcct: req.user._id})
    .populate("requestSenderId")
    .then(resp => {
        if (resp !== null) {
            const sender = resp.requestSenderId.find((senderId) => {
                if (senderId == req.params.requestId) {
                    return senderId
                } 
            })
            
        }
    })
}) */

.post(cors.corsWithOption, authenticate.verifyUser, (req, res, next) => {
    Request.findOne({myAcct: req.params.requestId})
    .then(resp => {
        const idx = resp.requestSenderId.indexOf(req.user._id)
        if (idx === -1) {
            resp.requestSenderId.push(req.user._id)
            resp.save()
            .then(resp => {
                Request.findById(resp._id)
                .populate("requestSenderId")
                .then(resp => {
                    res.statusCode = 200;
                })
            })
        } else {
            res.statusCode = 401;
        }
    }, (err) => next(err)).catch(err => next(err));

    Request.findOne({myAcct: req.user._id})
    .then(resp => {
        const idx = resp.requestISend.indexOf(req.params.requestId)
        if (idx === -1) {
            resp.requestISend.push(req.params.requestId)
            resp.save()
            .then(resp => {
                Request.findById(resp._id).populate("requestISend")
                .then(resp => {
                    res.statusCode = 200;
                    return res.setHeader("Content-Type", "application/json");
                    res.json({success: true, requestISend: resp});
                })
            })
        } else {
            res.statusCode = 401;
        }
    })
})

/* .put(cors.cors, authenticate.verifyUser,  (req, res, next) => {
    Request.findOne({myAcct: req.params.requestId})
    .then(resp => {
        const sender = resp.requestISend.findIndex((idx) => {
            return idx == req.params.requestId
        })
        resp.requestSenderId.splice(sender, 1)
        resp.save()
        .then(resp => {
            res.statusCode = 200;
            res.setHeader("Content-Type", "application/json");
            res.json({success: true, status: "Rrquest rejected."})
        })
    })
}) */

.delete(cors.corsWithOption, authenticate.verifyUser, (req, res, next) => {
    Request.findOne({myAcct: req.user._id})
    .then(resp => {
        const sender = resp.requestSenderId.findIndex((idx) => {
            return idx == req.params.requestId
        })
        resp.requestSenderId.splice(sender, 1)
        resp.save()
        .then(resp => {
            res.statusCode = 200;
            res.setHeader("Content-Type", "application/json");
            res.json({success: true, status: "Successfully deleted."})
        }, (err) => next(err)).catch(err => next(err))
    })
    
})
module.exports = requestRouter;
var express = require("express");
const authenticate = require("../authenticate");
const cors = require("./cors")
var bodyParser = require("body-parser");
var githubRouter = express.Router()

githubRouter.use(bodyParser.json())

githubRouter.route("/:userAcctName")
.options(cors.corsWithOption, (req, res) => res.sendStatus(200))
.get(cors.cors, authenticate.verifyUser, (req, res, next) => {
    fetch(`https://api.github.com/users/${req.params.userAcctName}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        }
    })
    .then(resp => {
        res.statusCode = 200
        return resp.json()
    }).then(resp => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(resp)
    })
})

githubRouter.route("/:userAcctName/:repo")
.options(cors.corsWithOption, (req, res) => res.sendStatus(200))
.get(cors.cors, authenticate.verifyUser, (req, res, next) => {
    fetch(`https://api.github.com/repos/${req.params.userAcctName}/${req.params.repo}/stats/punch_card`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        }
    })
    .then(resp => {
        res.statusCode = 200
        return resp.json()
    }).then(resp => {
        // filtering and getting the sum of commit to a repo per day based on the day number 0-6 representing sunday to saturday.
        const day_arr_with_commit = resp.filter(element => {
            if (element[2] !== 0) {
                return element
            }
        });/* 
        let day_number = [0, 1, 2, 3, 4, 5, 6];
        let weekday_commit = {"0": 0, "1": 0, "2": 0, "3": 0, "4": 0, "5": 0, "6": 0}; */
        let sum = 0
        day_arr_with_commit.forEach((element) => {
            sum += element[2]
        })
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(sum)
    })
})
/* .get(cors.cors, authenticate.verifyUser, (req, res, next) => {
    fetch(`https://api.github.com/user/${req.params.userAcctName}/${req.params.repo}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        }
    })
    .then(resp => {
        res.statusCode = 200
        return resp.json()
    }).then(resp => {
        
    })
}) */
module.exports = githubRouter;
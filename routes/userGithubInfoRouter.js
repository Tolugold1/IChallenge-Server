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
        const date = new Date()
        const day = date.getDay()
        const day_arr = resp.filter(element => {
            if (element[0] === day && element[0][2] !== 0) {
                return element
            }
        });
        console.log(day_arr)
        let sum = 0
        for (let i = 0; i <= day_arr.length - 1; i++) {
            sum += day_arr[i][2]
        }
        console.log(sum)
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(sum)
    })
})

module.exports = githubRouter;
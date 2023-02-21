var express = require("express");
const authenticate = require("./authenticate");
const cors = require("./cors")
var bodyParser = require("body-parser");
var repoRouter = express.Router()

repoRouter.use(bodyParser.json())

repoRouter.route("/:usergitname")
.options(cors.corsWithOption, (req, res) => res.sendStatus(200))
.get(cors.cors, authenticate.verifyUser, (req, res, next) => {
    fetch(`https://api.github.com/users/${req.params.usergitname}/repos`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        }
    })
    .then(resp => {
        res.statusCode = 200
        return resp.json()
    }).then(resp => {
        let name = []
        for (let i = 0; i <= resp.length - 1; i++) {
            name.push({name: resp[i].name})
        }
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(name)
    })
})

module.exports = repoRouter;
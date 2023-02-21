const express = require("express");
const bodyParser = require("body-parser");
const AWS = require("aws-sdk");
const s3 = new AWS.S3()
const cors = require("./cors")
const authenticate = require("../authenticate")
const userDetail = require("../Model/userDetails")
const profilePics = express.Router()
profilePics.use(bodyParser.json());


profilePics.get(cors.corsWithOption, authenticate.verifyUser, async (req,res) => {
  let filename = req.path.slice(1)

  try {
    let s3File = await s3.getObject({
      Bucket: process.env.BUCKET,
      Key: filename,
    }).promise()

    res.set('Content-type', s3File.ContentType)
    res.send(s3File.Body.toString()).end()
  } catch (error) {
    if (error.code === 'NoSuchKey') {
      console.log(`No such key ${filename}`)
      res.sendStatus(404).end()
    } else {
      console.log(error)
      res.sendStatus(500).end()
    }
  }
})
  
profilePics.put(cors.corsWithOption, authenticate.verifyUser, async (req,res) => {
    let filename = req.path.slice(1)
  
    console.log(typeof req.body)
  
    await s3.putObject({
      Body: JSON.stringify(req.body),
      Bucket: process.env.BUCKET,
      Key: filename,
    }).promise()
  
    res.set('Content-type', 'application/json')
    res.send('ok').end()
  })

  profilePics.delete(cors.corsWithOption, authenticate.verifyUser, async (req,res) => {
    let filename = req.path.slice(1)
  
    await s3.deleteObject({
      Bucket: process.env.BUCKET,
      Key: filename,
    }).promise()
  
    res.set('Content-type', 'application/json')
    res.send('ok').end()
  })

module.exports = profilePics;
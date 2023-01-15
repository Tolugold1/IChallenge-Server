const mongoose = require('mongoose');
const Schema = mongoose.Schema

const AcceptSchema = new Schema({
    peerUserId: {
        type: String
    }
})

const Accept = mongoose.model("AcceptSchema", AcceptSchema);
module.exports = Accept;
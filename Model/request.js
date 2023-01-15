const mongoose = require('mongoose');
const Schema = mongoose.Schema

const requestSchema = new Schema({
    peerUserId: {
        type: String
    }
})

const Request = mongoose.model("requestSchema", requestSchema);
module.exports = Request;
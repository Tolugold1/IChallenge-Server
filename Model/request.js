const mongoose = require('mongoose');
const Schema = mongoose.Schema

const requestSchema = new Schema({
    myAcct: {
        type: String,
    },
    requestSenderId: [{
        type: Schema.Types.ObjectId,
        ref: "User"
    }],
    requestISend: [{
        type: Schema.Types.ObjectId,
        ref: "User"
    }]
}, {timestamps: true})

const Request = mongoose.model("request", requestSchema);
module.exports = Request;
const mongoose = require('mongoose');
const { ObjectId } = require('mongoose/lib/types');
const Schema = mongoose.Schema

const AcceptSchema = new Schema({
    myAcct: {
        type: String
    },
    Acceptedrequest: [{
        type: Schema.Types.ObjectId,
        ref: "User"
    }]
}, {timestamps: true})

const Accept = mongoose.model("accept", AcceptSchema);
module.exports = Accept;
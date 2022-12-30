const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const detailSchema = new Schema({
    userId: {
        type: String,
    },
    fullname: {
        type: String,
        default: ""
    },
    twittername: {
        type: String,
        default: ""
    },
    githubname: {
        type: String,
        default: ""
    },
    facebookname: {
        type: String,
        default: ""
    },
    pics: {
        data: Buffer,
        contentType: String
    }
})

const UserDetails = mongoose.model("UserDetails", detailSchema);

module.exports = UserDetails;
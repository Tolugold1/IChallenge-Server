const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const detailSchema = new Schema({
    /* fullname: {
        type: String,
        default: ""
    },
    twitterName: {
        type: String,
        default: ""
    },
    githubName: {
        type: String,
        default: ""
    },
    facebookName: {
        type: String,
        default: ""
    }, */
    img: {
        data: Buffer,
        contentType: String
    }
})

const UserDetails = mongoose.model("UserDetails", detailSchema);

module.exports = UserDetails;
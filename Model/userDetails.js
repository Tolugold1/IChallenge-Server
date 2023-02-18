const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const detailSchema = new Schema({
    userId: {
        type: String,
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
    },
    number_of_challenge_days: {
        type: Number,
        default: 0
    },
    github_repo_name: {
        type: String,
        default: ""
    }
})

const UserDetails = mongoose.model("UserDetails", detailSchema);

module.exports = UserDetails;
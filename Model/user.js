const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose")


const userSchema = new Schema({
    fullname: {
        type: String,
        require: true
    },
    email: {
        type: String,
        default: ""
    },
    githubId: {
        type: String
    },
    admin: {
        type: Boolean,
        default: false
    }
})

userSchema.plugin(passportLocalMongoose)

const User = mongoose.model("User", userSchema)
module.exports = User;
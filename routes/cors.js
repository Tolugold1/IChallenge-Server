const cors = require("cors");

const urls = ["http://localhost:3000", "https://localhost:3443", "http://localhost:3001", "https://challenge-tolugold1.vercel.app/", "https://coral-fish-vest.cyclic.app/"];

const corsDelegate = (req, cb) => {
    var corsOption;
    console.log(req.header('Access-Control-Allow-Origin'));
    if (urls.indexOf(req.header("Access-Control-Allow-Origin")) !== -1) {
        corsOption = { origin: true }
    } else {
        corsOption = { option: false }
    }
    cb(null, corsOption);
}

exports.cors = cors();
exports.corsWithOption = cors(corsDelegate);

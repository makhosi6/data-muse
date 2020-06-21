const express = require("express");
const hotRouta = express.Router();

let trendsHot = [];
//
const hot = require("../sources/trends-hot");
//
hot.trendsHot.map((a) => trendsHot.push(a));

//
hotRouta.get("/trends-hot", (req, res) => {
    res.send({
        trendsHot
    });
});
module.exports = hotRouta;
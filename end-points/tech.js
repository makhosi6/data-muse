const express = require("express");
const techRouta = express.Router();
//
const cnn = require("../sources/cnn");
const bbc = require("../sources/bbc");
const sa = require("../sources/sa");

let tech = [];
///
bbc.tech.map((a) => tech.push(a));
cnn.tech.map((a) => tech.push(a));
sa.tech.map((a) => tech.push(a));


techRouta.get("/tech", (req, res) => {
    res.send({
        tech
    });
});
module.exports = techRouta;
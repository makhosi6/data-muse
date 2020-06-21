const express = require("express");
const healthRouta = express.Router();
//
const bbc = require("../sources/bbc");
const cnn = require("../sources/cnn");

let health = [];

//
bbc.health.map((a) => health.push(a));
cnn.health.map((a) => health.push(a));

healthRouta.get("/health", (req, res) => {
    res.send({
        health
    });
});
module.exports = healthRouta;
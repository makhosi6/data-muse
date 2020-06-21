const express = require("express");
const trendsRouta = express.Router();

let trends = [];
//
const alj = require("../sources/alj");
const africa = require("../sources/africa");
const enca = require("../sources/enca");
const ewn = require("../sources/ewn");
const kickoff = require("../sources/kickoff");
//
alj.trending.map((a) => trends.push(a));
africa.trending.map((a) => trends.push(a));
enca.trends.map((a) => trends.push(a));
ewn.trending.map((a) => trends.push(a));
kickoff.trends.map((a) => trends.push(a));
//
trendsRouta.get("/trends", (req, res) => {
    res.send({
        trends
    });
});
module.exports = trendsRouta;
const express = require("express");
const sportRouta = express.Router();
//
const bbc = require("../sources/bbc");
const enca = require("../sources/enca");
const ewn = require("../sources/ewn");
const kickoff = require("../sources/kickoff");
const laduma = require("../sources/laduma");
const sa = require("../sources/sa");
const sabc = require("../sources/sabc");
const timeslive = require("../sources/timeslive");
const espn = require("../sources/flipboard/espn");

let sport = [];

///

bbc.sport.map((a) => sport.push(a));

enca.sport.map((a) => sport.push(a));

ewn.sport.map((a) => sport.push(a));
//
kickoff.news.map((a) => sport.push(a));
//
laduma.news.map((a) => sport.push(a));
laduma.sport.map((a) => sport.push(a));
//
sa.sport.map((a) => sport.push(a));
//
sabc.sport.map((a) => sport.push(a));
//
timeslive.sport.map((a) => sport.push(a));
///
espn.news.map((a) => sport.push(a));


sportRouta.get("/sport", (req, res) => {
    res.send({
        sport
    });
});
module.exports = sportRouta;
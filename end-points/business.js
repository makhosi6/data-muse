const express = require("express");
const businessRouta = express.Router();
//
const cnn = require("../sources/cnn");
const enca = require("../sources/enca");
const hbr = require("../sources/hbr");
const sa = require("../sources/sa");
const sabc = require("../sources/sabc");
const timeslive = require("../sources/timeslive");
const wired = require("../sources/wired");

let business = [];

///
cnn.business.map((a) => business.push(a));
//
enca.business.map((a) => business.push(a));
//
hbr.news.map((a) => business.push(a));
hbr['most popular'].map((a) => business.push(a));
hbr.research.map((a) => business.push(a));
hbr.video.map((a) => business.push(a));
//
sa.business.map((a) => business.push(a));
//
sabc.business.map((a) => business.push(a));
///
timeslive.business.map((a) => business.push(a));
///
wired.business.map((a) => business.push(a));

businessRouta.get("/business", (req, res) => {
    res.send({
        business
    });
});
module.exports = businessRouta;
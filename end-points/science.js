const express = require("express");
const scienceRouta = express.Router();
//
const bbc = require("../sources/bbc");
const sabc = require("../sources/sabc");
const wired = require("../sources/wired");
const natgeo = require("../sources/flipboard/nat-geo");

let science = [];

///
bbc.real.map((a) => science.push(a));
//
sabc.science.map((a) => science.push(a));
///
wired.science.map((a) => science.push(a));
//
natgeo.science.map((a) => science.push(a));

scienceRouta.get("/science", (req, res) => {
    res.send({
        science
    });
});
module.exports = scienceRouta;
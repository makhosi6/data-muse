const express = require("express");
const lifestyleRouta = express.Router();
//
const alj = require("../sources/alj");
const africa = require("../sources/africa");
const bbc = require("../sources/bbc");
const bloomberg = require("../sources/bloomberg");
const cgtn = require("../sources/cgtn");
const citizen = require("../sources/citizen");
const cnn = require("../sources/cnn");
const enca = require("../sources/enca");
const ewn = require("../sources/ewn");
const hbr = require("../sources/hbr");
const kickoff = require("../sources/kickoff");
const laduma = require("../sources/laduma");
const life = require("../sources/life");
const magz = require("../sources/magz");
const mAndG = require("../sources/mAndG");
const sa = require("../sources/sa");
const sabc = require("../sources/sabc");
const timeslive = require("../sources/timeslive");
const wired = require("../sources/wired");
const enews = require("../sources/flipboard/enews");
const espn = require("../sources/flipboard/espn");
const foodWine = require("../sources/flipboard/foodWine");
const natgeo = require("../sources/flipboard/nat-geo");

let lifestyle = [];

///

bbc.real.map((a) => lifestyle.push(a));
//
ewn.lifestyle.map((a) => lifestyle.push(a));
//
life.news.map((a) => lifestyle.push(a));
//
magz['men lifestyle'].map((a) => lifestyle.push(a));
magz['women lifestyle'].map((a) => lifestyle.push(a));
magz.vogue.map((a) => lifestyle.push(a));
magz.you.map((a) => lifestyle.push(a));
//
mAndG.lifestyle.map((a) => lifestyle.push(a));
//
sa.lifestyle.map((a) => lifestyle.push(a));
//
wired.lifestyle.map((a) => lifestyle.push(a));
//

lifestyleRouta.get("/lifestyle", (req, res) => {
    res.send({
        lifestyle
    });
});
module.exports = lifestyleRouta;
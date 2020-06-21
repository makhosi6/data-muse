const express = require("express");
const newsRouta = express.Router();
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

let news = [];

///
alj.documentaries.map((a) => news.push(a));
alj.africa.map((a) => news.push(a));
alj.news.map((a) => news.push(a));
//
africa.news.map((a) => news.push(a));
africa.trending.map((a) => news.push(a));
//
bbc.africa.map((a) => news.push(a));
bbc.news.map((a) => news.push(a));
bbc.real.map((a) => news.push(a));
bbc.health.map((a) => news.push(a));
bbc.sport.map((a) => news.push(a));
bbc.tech.map((a) => news.push(a));
//
bloomberg.news.map((a) => news.push(a));
//
cgtn.news.map((a) => news.push(a));
//
citizen.news.map((a) => news.push(a));
//
cnn.world.map((a) => news.push(a));
cnn.africa.map((a) => news.push(a));
cnn.tech.map((a) => news.push(a));
cnn.health.map((a) => news.push(a));
cnn.business.map((a) => news.push(a));
//
enca.sport.map((a) => news.push(a));
enca.video.map((a) => news.push(a));
enca.business.map((a) => news.push(a));
//
ewn.news.map((a) => news.push(a));
ewn.lifestyle.map((a) => news.push(a));
ewn.politics.map((a) => news.push(a));
ewn.sport.map((a) => news.push(a));
//
hbr.news.map((a) => news.push(a));
hbr['most popular'].map((a) => news.push(a));
hbr.research.map((a) => news.push(a));
hbr.video.map((a) => news.push(a));
//
kickoff.news.map((a) => news.push(a));
//
laduma.news.map((a) => news.push(a));
laduma.sport.map((a) => news.push(a));
//
life.news.map((a) => news.push(a));
//
magz['men lifestyle'].map((a) => news.push(a));
magz['women lifestyle'].map((a) => news.push(a));
magz.vogue.map((a) => news.push(a));
magz.you.map((a) => news.push(a));
//
mAndG.lifestyle.map((a) => news.push(a));
//
sa.business.map((a) => news.push(a));
sa.motoring.map((a) => news.push(a));
sa.lifestyle.map((a) => news.push(a));
sa.news.map((a) => news.push(a));
sa.tech.map((a) => news.push(a));
sa.sport.map((a) => news.push(a));
//
sabc.news.map((a) => news.push(a));
sabc.business.map((a) => news.push(a));
sabc.politics.map((a) => news.push(a));
sabc.science.map((a) => news.push(a));
sabc.sport.map((a) => news.push(a));
sabc.world.map((a) => news.push(a));
///
timeslive.business.map((a) => news.push(a));
timeslive.news.map((a) => news.push(a));
timeslive.sport.map((a) => news.push(a));
///
wired.science.map((a) => news.push(a));
wired.business.map((a) => news.push(a));
wired.lifestyle.map((a) => news.push(a));
//
enews.news.map((a) => news.push(a));
//
espn.news.map((a) => news.push(a));
//
foodWine.foodWine.map((a) => news.push(a));
foodWine.foodWineRecipes.map((a) => news.push(a));
//
natgeo.animals.map((a) => news.push(a));
natgeo.news.map((a) => news.push(a));
natgeo.photo.map((a) => news.push(a));
natgeo.environnment.map((a) => news.push(a));
natgeo.science.map((a) => news.push(a));
natgeo.travel.map((a) => news.push(a));

newsRouta.get("/news", (req, res) => {
    res.send({
        news
    });
});
module.exports = newsRouta;
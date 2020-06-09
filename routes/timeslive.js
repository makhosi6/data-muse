const express = require('express');
const timesLiveBusi = express.Router();
const puppet = require('./store/puppetTImes');
///
process.setMaxListeners(Infinity);
//
let sources = {
        business: "https://www.timeslive.co.za/sunday-times/business/",
        news: "https://www.timeslive.co.za/",
        sport: "https://www.timeslive.co.za/sport/"
    }
    //
const Puppet = puppet.Scrapper;
//one
const dataOne = new Puppet(sources.business);
dataOne.puppet();
//Two
const dataTwo = new Puppet(sources.news);
dataTwo.puppet();
//Three
const dataThree = new Puppet(sources.sport);
dataThree.puppet();
/////
timesLiveBusi.get('/times-live', (req, res) => {
    res.send({
        "timesLiveBusi": dataOne,
        "timesLive": dataTwo,
        "timesLiveSport": dataThree
    });
})

module.exports = timesLiveBusi;
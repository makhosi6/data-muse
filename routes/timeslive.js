const express = require('express');
const timesLiveBusi = express.Router();
const cron = require("node-cron");
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
//Two
const dataTwo = new Puppet(sources.news);
//Three
const dataThree = new Puppet(sources.sport);
/////

cron.schedule("0 */6 * * *", () => {

    (() => {
        console.log('\x1b[46m%s\x1b[0m', "TIMES-LIVES fired at:", Date());
        dataTwo.puppet();
        dataOne.puppet();
        dataThree.puppet();

    })();
});


timesLiveBusi.get('/times-live', (req, res) => {
    res.send({
        "timesLiveBusi": dataOne.data,
        "timesLive": dataTwo.data,
        "timesLiveSport": dataThree.data
    });
})

module.exports = timesLiveBusi;
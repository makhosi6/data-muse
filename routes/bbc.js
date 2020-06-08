const express = require('express');
const bbcBusiness = express.Router();
const puppet = require('./store/puppetBbc');
require('dotenv').config();
process.setMaxListeners(Infinity);

//
let sources = {
        news: "https://www.bbc.com/news/business",
        africa: "https://www.bbc.com/news/world/africa",
        health: "https://www.bbc.com/news/health",
        real: "https://www.bbc.com/news/reality_check",
        sport: "https://www.bbc.com/sport",
        tech: "https://www.bbc.com/news/technology",
    }
    //
const Puppet = puppet.Scrapper;
//one
const dataOne = new Puppet(sources.news);
dataOne.puppet();
//Two
const dataTwo = new Puppet(sources.africa);
dataTwo.puppet();
//Three
const dataThree = new Puppet(sources.health);
dataThree.puppet();
//Four
const dataFour = new Puppet(sources.real);
dataFour.puppet();
//Five
const dataFive = new Puppet(sources.sport);
dataFive.puppet();
//Six
const dataSix = new Puppet(sources.tech);
dataSix.puppet();


//


bbcBusiness.get('/bbc', (req, res) => {
    res.send({
        "africa": dataTwo,
        "news": dataOne,
        "real": dataFour,
        "health": dataThree,
        "sport": dataFive,
        "tech": dataSix
    });
})
module.exports = bbcBusiness;
const express = require('express');
require('dotenv').config()
const saFinance = express.Router();
const puppet = require('./store/saScrapper');
//
process.setMaxListeners(Infinity);
//
let sources = {
        finance: "https://www.thesouthafrican.com/news/finance/",
        motoring: "https://www.thesouthafrican.com/lifestyle/motoring/",
        life: "https://www.thesouthafrican.com/lifestyle/",
        news: "https://www.thesouthafrican.com/news/finance/",
        tech: "https://www.thesouthafrican.com/technology/",
        sport: "https://www.thesouthafrican.com/sport/",
    }
    //
const Puppet = puppet.Scrapper;
//one
const dataOne = new Puppet(sources.finance);
dataOne.puppet();
//Two
const dataTwo = new Puppet(sources.motoring);
dataTwo.puppet();
//Three
const dataThree = new Puppet(sources.life);
dataThree.puppet();
//Four
const dataFour = new Puppet(sources.news);
dataFour.puppet();
//Five
const dataFive = new Puppet(sources.tech);
dataFive.puppet();
//Six
const dataSix = new Puppet(sources.sport);
dataSix.puppet();

/////
saFinance.get('/sa-scrapper', (req, res) => {
    res.send({

        "saFinance": dataOne,
        "saMotoring": dataTwo,
        "saLife": dataThree,
        "saNews": dataFour,
        "saTech": dataFive,
        "saSport": dataSix
    });
})

module.exports = saFinance;
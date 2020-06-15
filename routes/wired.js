const express = require('express');
const wiredBusiness = express.Router();
require('dotenv').config();
const puppet = require('./store/puppetWired');
///
process.setMaxListeners(Infinity);

//
let sources = {
        science: "https://www.wired.com/category/science/",
        business: "https://www.wired.com/category/business/",
        gear: "https://www.wired.com/category/gear/",
    }
    ///
const Puppet = puppet.Scrapper;
//one
const dataOne = new Puppet(sources.science);
dataOne.puppet();
//Two
const dataTwo = new Puppet(sources.business);
dataTwo.puppet();
//Three
const dataThree = new Puppet(sources.gear);
dataThree.puppet();
///
wiredBusiness.get('/wired-all', (req, res) => {
    res.send({
        "wiredScience": dataOne.data,
        "wiredBusiness": dataTwo.data,
        "wiredGear": dataThree.data
    });
})

module.exports = wiredBusiness;
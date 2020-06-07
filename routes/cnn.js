const express = require('express');
const cnnRouta = express.Router();
require('dotenv').config()
const puppet = require('./store/puppetCnn');
const vars = require('./store/storeVars')
    //
process.setMaxListeners(Infinity);
///
let sources = {
        world: "https://edition.cnn.com/world",
        africa: "https://edition.cnn.com/africa",
        tech: "https://edition.cnn.com/business/tech",
        health: "https://edition.cnn.com/health",
        business: "https://edition.cnn.com/business",
    }
    //
const Puppet = puppet.Scrapper;
//one
const dataOne = new Puppet(sources.world);
dataOne.puppet();
//Two
const dataTwo = new Puppet(sources.africa);
dataTwo.puppet();
//Three
const dataThree = new Puppet(sources.tech);
dataThree.puppet();
//Four
const dataFour = new Puppet(sources.health);
dataFour.puppet();
//Five
const dataFive = new Puppet(sources.business);
dataFive.puppet();
//


/////////////
cnnRouta.get('/cnn', (req, res) => {
    res.send({

        "world": dataOne,
        "africa": dataTwo,
        "tech": dataThree,
        "health": dataFour,
        "business": dataFive
    });
})

module.exports = cnnRouta;
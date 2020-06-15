const express = require('express');
const espn = express.Router();
const puppet = require('../store/puppetFlipBoard');
//
process.setMaxListeners(Infinity);
///
const Puppet = puppet.Scrapper;
let source = "https://flipboard.com/@espn";
const dataOne = new Puppet(source);

dataOne.puppet();
/////////////
espn.get('/espn', (req, res) => {
    res.send({
        "espn": dataOne.data
    });
})

module.exports = espn;
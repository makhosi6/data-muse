const express = require('express');
const espn = express.Router();
const puppet = require('../store/puppetFlipBoard');
//
process.setMaxListeners(Infinity);
///
const Puppet = puppet.Scrapper;
let source = "https://flipboard.com/@espn";
const data = new Puppet(source);

let fin = data.puppet();
/////////////
espn.get('/espn', (req, res) => {
    res.send({
        "espn": data
    });
})

module.exports = espn;
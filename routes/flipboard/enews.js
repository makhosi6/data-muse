const express = require('express');
const espnEnews = express.Router();
const puppet = require('../store/puppetFlipBoard');
//
process.setMaxListeners(Infinity);
///
const Puppet = puppet.Scrapper;
let source = "https://flipboard.com/@enews";
const data = new Puppet(source);

data.puppet();
/////////////
espnEnews.get('/enews', (req, res) => {
    res.send({

        "espnEnews": data,

    });
})
module.exports = espnEnews;
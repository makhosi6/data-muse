const express = require('express');
const espn = express.Router();
const cron = require("node-cron");
const puppet = require('../store/puppetFlipBoard');
//
process.setMaxListeners(Infinity);
///
const Puppet = puppet.Scrapper;
let source = "https://flipboard.com/@espn";
const dataOne = new Puppet(source);

cron.schedule("0 3 * * *", () => {

    (() => {
        console.log('\x1b[46m%s\x1b[0m', "ESPN fired at:", Date());
        dataOne.puppet();
    })();
});


/////////////
espn.get('/espn', (req, res) => {
    res.send({
        "espn": dataOne.data
    });
})

module.exports = espn;
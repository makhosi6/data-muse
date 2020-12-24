const cron = require("node-cron");
const express = require("express");
const Routa = express.Router();
const puppet = require('../../store/puppetFlipBoard');
//
process.setMaxListeners(Infinity);
const Puppet = puppet.Scrapper;
let source = "https://flipboard.com/@enews";
const dataOne = new Puppet(source, "eNews");
///
// cron.schedule("0 4 * * SUN", () => {
        console.log('\x1b[46m%s\x1b[0m', "ENEWS fired at:" + Date());
        //
        dataOne.puppet();

// });

Routa.get('/enews', (req, res) => {
    res.send({

        "news": dataOne.data,

    });
});
module.exports = Routa;
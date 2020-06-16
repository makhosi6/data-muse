const express = require('express');
const natGeoAnimals = express.Router();
const vars = require('../store/storeVars');
const cron = require("node-cron");
const puppet = require('../store/puppetFlipBoard');
//
process.setMaxListeners(Infinity);
//
let sources = {
        animals: "https://flipboard.com/@nationalgeographic/animals-et7cccbnz",
        news: "https://flipboard.com/@nationalgeographic/news-7mqhsd63z",
        photo: "https://flipboard.com/@nationalgeographic/photography-krv08c4hz",
        enviro: "https://flipboard.com/@nationalgeographic/environment-6rpgsr1kz",
        travel: "https://flipboard.com/@nationalgeographic/travel-es7qj2fiz",
        science: "https://flipboard.com/@nationalgeographic/science-b8caucnjz"

    }
    //
const Puppet = puppet.Scrapper;
//one
const dataOne = new Puppet(sources.animals);
//two
const dataTwo = new Puppet(sources.news);
//three
const dataThree = new Puppet(sources.photo);
dataThree.puppet();
//four
const dataFour = new Puppet(sources.enviro);
//five
const dataFive = new Puppet(sources.science);
//six
const dataSix = new Puppet(sources.travel);

cron.schedule("0 4 * * SUN", () => {
    (() => {
        console.log('\x1b[46m%s\x1b[0m', "NAT_GEO fired at:", Date());
        //

        dataOne.puppet();
        dataTwo.puppet();
        dataFour.puppet();
        dataFive.puppet();
        dataSix.puppet();

    })();
});


natGeoAnimals.get('/flipboard/natgeo', (req, res) => {
    res.send({
        "natGeoAnimals": dataOne.data,
        "natGeoNews": dataTwo.data,
        "espnNatGoe": dataThree.data,
        "natGeoPhoto": dataFour.data,
        "natGeoSci": dataFive.data,
        "natGeoTravel": dataSix.data
    });
})

module.exports = natGeoAnimals;
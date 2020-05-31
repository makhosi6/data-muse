const express = require('express');
const natGeoAnimals = express.Router();
const vars = require('../store/storeVars');
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
dataOne.puppet();
//two
const dataTwo = new Puppet(sources.news);
dataTwo.puppet();
//three
const dataThree = new Puppet(sources.photo);
dataThree.puppet();
//four
const dataFour = new Puppet(sources.enviro);
dataFour.puppet();
//five
const dataFive = new Puppet(sources.science);
dataFive.puppet();
//six
const dataSix = new Puppet(sources.travel);
dataSix.puppet();

natGeoAnimals.get('/flipboard/natgeo', (req, res) => {
    res.send({
        "natGeoAnimals": dataOne,
        "natGeoNews": dataTwo,
        "espnNatGoe": dataThree,
        "natGeoPhoto": dataFour,
        "natGeoSci": dataFive,
        "natGeoTravel": dataSix
    });
})

module.exports = natGeoAnimals;
const express = require('express');
const natGeoAnimals = express.Router();
const vars = require('../store/storeVars');
const puppet = require('../store/puppetFlipBoard');
//
process.setMaxListeners(Infinity);
//one
const PuppetOne = puppet.Scrapper;
let source_animals = "https://flipboard.com/@nationalgeographic/animals-et7cccbnz";
const dataOne = new PuppetOne(source_animals);
dataOne.puppet();
//two
const PuppetTwo = puppet.Scrapper;
let source_news = "https://flipboard.com/@nationalgeographic/news-7mqhsd63z";
const dataTwo = new PuppetTwo(source_news);
dataTwo.puppet();
//three
const PuppetThree = puppet.Scrapper;
let source_photo = "https://flipboard.com/@nationalgeographic/photography-krv08c4hz";
const dataThree = new PuppetThree(source_photo);
dataThree.puppet();
//four
const PuppetFour = puppet.Scrapper;
let source_enviro = "https://flipboard.com/@nationalgeographic/environment-6rpgsr1kz";
const dataFour = new PuppetFour(source_enviro);
dataFour.puppet();
//five
const PuppetFive = puppet.Scrapper;
let source_science = "https://flipboard.com/@nationalgeographic/science-b8caucnjz";
const dataFive = new PuppetFive(source_science);
dataFive.puppet();
//six
const PuppetSix = puppet.Scrapper;
let source_travel = "https://flipboard.com/@nationalgeographic/travel-es7qj2fiz";
const dataSix = new PuppetSix(source_travel);
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
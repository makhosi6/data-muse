const express = require('express');
const foodWine = express.Router();
const puppet = require('../store/puppetFlipBoard');
//
process.setMaxListeners(Infinity);
//
let sources = {
        news: "https://flipboard.com/@foodandwine",
        recipe: "https://flipboard.com/@foodandwine/recipes-n1s9kfsoz"

    }
    //
const Puppet = puppet.Scrapper;
//one
const dataOne = new Puppet(sources.news);
dataOne.puppet();
//two
const dataTwo = new Puppet(sources.recipe);
dataTwo.puppet();

/////////////
foodWine.get('/foodwine', (req, res) => {
    res.send({
        "foodWine": dataOne.data,
        "foodWineRecipes": dataTwo.data
    });
})

module.exports = foodWine;
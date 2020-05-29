const express = require('express');
const foodWine = express.Router();
const puppet = require('../store/puppetFlipBoard');
//
process.setMaxListeners(Infinity);
//one
const PuppetOne = puppet.Scrapper;
let source_news = "https://flipboard.com/@foodandwine";
const dataOne = new PuppetOne(source_news);
dataOne.puppet();
//two
const PuppetTwo = puppet.Scrapper;
let source_recipe = "https://flipboard.com/@foodandwine/recipes-n1s9kfsoz";
const dataTwo = new PuppetTwo(source_recipe);
dataTwo.puppet();

/////////////
foodWine.get('/foodwine', (req, res) => {
    res.send({
        "foodWine": dataOne,
        "foodWineRecipes": dataTwo
    });
})

module.exports = foodWine;
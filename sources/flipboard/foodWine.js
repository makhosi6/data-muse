const cron = require("node-cron");
const puppet = require('../../store/puppetFlipBoard');
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
//two
const dataTwo = new Puppet(sources.recipe);

//////
cron.schedule("0 4 * * SUN", () => {
    (() => {
        console.log('\x1b[46m%s\x1b[0m', "FOODWINE fired at:" + Date());
        dataOne.puppet();
        dataTwo.puppet();
    })();
});

///
module.exports = {
    "foodWine": dataOne.data,
    "foodWineRecipes": dataTwo.data
};
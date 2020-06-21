const puppet = require('./store/puppetBbc');
require('dotenv').config();
const cron = require("node-cron");
process.setMaxListeners(Infinity);

//
let sources = {
        news: "https://www.bbc.com/news/business",
        africa: "https://www.bbc.com/news/world/africa",
        health: "https://www.bbc.com/news/health",
        real: "https://www.bbc.com/news/reality_check",
        sport: "https://www.bbc.com/sport",
        tech: "https://www.bbc.com/news/technology",
    }
    //
const Puppet = puppet.Scrapper;
//one
const dataOne = new Puppet(sources.news);
//Two
const dataTwo = new Puppet(sources.africa);
//Three
const dataThree = new Puppet(sources.health);
//Four
const dataFour = new Puppet(sources.real);
//Five
const dataFive = new Puppet(sources.sport);
//Six
const dataSix = new Puppet(sources.tech);

cron.schedule("0 */6 * * *", () => {

    (() => {
        console.log('\x1b[46m%s\x1b[0m', "BCC fired at:" + Date());

        dataOne.puppet();
        dataTwo.puppet();
        dataThree.puppet();
        dataFour.puppet();
        dataFive.puppet();
        dataSix.puppet();

    })();
});
//

module.exports = {
    "africa": dataTwo.data,
    "news": dataOne.data,
    "real": dataFour.data,
    "health": dataThree.data,
    "sport": dataFive.data,
    "tech": dataSix.data
};
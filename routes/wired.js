const cron = require("node-cron");
const puppet = require('./store/puppetWired');
require('dotenv').config();
///
process.setMaxListeners(Infinity);

//
let sources = {
        science: "https://www.wired.com/category/science/",
        business: "https://www.wired.com/category/business/",
        gear: "https://www.wired.com/category/gear/",
    }
    ///


const Puppet = puppet.Scrapper;
//one
const dataOne = new Puppet(sources.science);
//Two
const dataTwo = new Puppet(sources.business);
//Three
const dataThree = new Puppet(sources.gear);
///
cron.schedule("0 4 * * SUN", () => {
    (() => {
        console.log('\x1b[46m%s\x1b[0m', "WIRED fired at:" + Date());
        dataOne.puppet();
        dataTwo.puppet();
        dataThree.puppet();
    })();
});
//
module.exports = {
    "science": dataOne.data,
    "business": dataTwo.data,
    "lifestyle": dataThree.data
};
const cron = require("node-cron");
const puppet = require('../store/puppetTImes');
///
process.setMaxListeners(Infinity);
//
let sources = {
        business: "https://www.timeslive.co.za/sunday-times/business/",
        news: "https://www.timeslive.co.za/",
        sport: "https://www.timeslive.co.za/sport/"
    }
    //
const Puppet = puppet.Scrapper;
//one
const dataOne = new Puppet(sources.business);
//Two
const dataTwo = new Puppet(sources.news);
//Three
const dataThree = new Puppet(sources.sport);
/////

cron.schedule("0 */6 * * *", () => {

    (() => {
        console.log('\x1b[46m%s\x1b[0m', "TIMES-LIVES fired at:" + Date());
        dataTwo.puppet();
        dataOne.puppet();
        dataThree.puppet();

    })();
});

//
module.exports = {
    "business": dataOne.data,
    "news": dataTwo.data,
    "sport": dataThree.data
};
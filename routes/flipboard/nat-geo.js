const cron = require("node-cron");
const puppet = require('../../store/puppetFlipBoard');
const express = require("express");
const Routa = express.Router();
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
const dataOne = new Puppet(sources.animals, "nationalgeographic");
//two
const dataTwo = new Puppet(sources.news, "nationalgeographic");
//three
const dataThree = new Puppet(sources.photo, "nationalgeographic");
//four
const dataFour = new Puppet(sources.enviro, "nationalgeographic");
//five
const dataFive = new Puppet(sources.science, "nationalgeographic");
//six
const dataSix = new Puppet(sources.travel, "nationalgeographic");

cron.schedule("0 4 * * SUN", () => {
    (() => {
        console.log('\x1b[46m%s\x1b[0m', "NAT_GEO fired at:" + Date());
        //
        dataOne.puppet();
        dataTwo.puppet();
        dataThree.puppet();
        dataFour.puppet();
        dataFive.puppet();
        dataSix.puppet();

    })();
});
//

Routa.get('/nat-geo', (req, res) => {
    res.send({
        "animals": dataOne.data,
        "news": dataTwo.data,
        "photo": dataThree.data,
        "environnment": dataFour.data,
        "science": dataFive.data,
        "travel": dataSix.data
    });
});
module.exports = Routa;
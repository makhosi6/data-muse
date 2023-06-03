const cron = require("node-cron");
const puppet = require("../../store/puppetFlipBoard");
const express = require("express");
const Routa = express.Router();
//

//
let sources = {
  animals: "https://flipboard.com/@nationalgeographic/animals-et7cccbnz",
  news: "https://flipboard.com/@nationalgeographic/news-7mqhsd63z",
  photo: "https://flipboard.com/@nationalgeographic/photography-krv08c4hz",
  enviro: "https://flipboard.com/@nationalgeographic/environment-6rpgsr1kz",
  travel: "https://flipboard.com/@nationalgeographic/travel-es7qj2fiz",
  science: "https://flipboard.com/@nationalgeographic/science-b8caucnjz",
};
//
const Puppet = puppet.Scrapper;
//one
const dataOne = new Puppet(sources.animals, "national geographic");
//two
const dataTwo = new Puppet(sources.news, "national geographic");
//three
const dataThree = new Puppet(sources.photo, "national geographic");
//four
const dataFour = new Puppet(sources.enviro, "national geographic");
//five
const dataFive = new Puppet(sources.science, "national geographic");
//six
const dataSix = new Puppet(sources.travel, "national geographic");

cron.schedule("0 */6 * * *", () => {
  console.log("\x1b[46m%s\x1b[0m", "NAT_GEO fired at:" + Date());
  //
  dataOne.puppet();
  dataTwo.puppet();
  dataThree.puppet();
  dataFour.puppet();
  dataFive.puppet();
  dataSix.puppet();
}); 
//

Routa.get("/nat-geo", (req, res) => {
  res.send({
    animals: dataOne.processes,
    news: dataTwo.processes,
    photo: dataThree.processes,
    environnment: dataFour.processes,
    science: dataFive.processes,
    travel: dataSix.processes,
  });
});
module.exports = Routa;

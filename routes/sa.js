const cron = require("node-cron");
const puppet = require("../store/saScrapper");
require("dotenv").config();
const express = require("express");
const Routa = express.Router();
//
let sources = {
  finance: "https://www.thesouthafrican.com/news/finance/",
  motoring: "https://www.thesouthafrican.com/lifestyle/motoring/",
  life: "https://www.thesouthafrican.com/lifestyle/",
  // news: "https://www.thesouthafrican.com/news/finance/",
  tech: "https://www.thesouthafrican.com/technology/",
  sport: "https://www.thesouthafrican.com/sport/",
};
//
const Puppet = puppet.Scrapper;
//one
const dataOne = new Puppet(sources.finance, "business");
//Two
const dataTwo = new Puppet(sources.motoring, "motoring");
//Three
const dataThree = new Puppet(sources.life, "lifestyle");
//Four
// const dataFour = new Puppet(sources.news);
//Five
const dataFive = new Puppet(sources.tech, "technology");
//Six
const dataSix = new Puppet(sources.sport, "sport");

cron.schedule("0 3 * * *", () => {
  console.log("\x1b[46m%s\x1b[0m", "SAan fired at:" + Date());
  dataOne.puppet();
  dataTwo.puppet();
  dataThree.puppet();
  // dataFour.puppet();
  dataFive.puppet();
  dataSix.puppet();
});

/////
module.exports = {};
//
Routa.get("/sa-scrapper", (req, res) => {
  res.send({
    business: dataOne.processes,
    motoring: dataTwo.processes,
    lifestyle: dataThree.processes,
    // "news": dataFour.processes,
    tech: dataFive.processes,
    sport: dataSix.processes,
  });
});
module.exports = Routa;

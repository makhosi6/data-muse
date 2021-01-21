require("dotenv").config();
const puppeteer = require("puppeteer");
const cron = require("node-cron");
const helpers = require("../store/helpers");
const wsChromeEndpointurl = require("../browser");
const puppet = require("../store/puppetAlj");
const express = require("express");
const Routa = express.Router();
//

let source = {
  africa: "https://www.aljazeera.com/topics/regions/africa.html",
  sport: "https://www.aljazeera.com/sports/",
  news: "https://www.aljazeera.com/tag/science-and-technology/",
};
//

const Puppet = puppet.Scrapper;

const dataAfrica = new Puppet(source.africa, "africa");
const dataSport = new Puppet(source.sport, "sport");
const dataNews = new Puppet(source.news, "Science and Technology");

//
cron.schedule("0 */6 * * *", () => {
  console.log("\x1b[46m%s\x1b[0m", "ALJ fired at:" + Date());
  dataAfrica.puppet();
  dataNews.puppet();
  dataSport.puppet();
  // main(source.docs, source.trending);
}); 

Routa.get("/alj", (req, res) => {
  res.send({
    africa: dataAfrica.processes,
    "science&technology": dataNews.processes,
    sport: dataSport.processes,
  });
});
module.exports = Routa;

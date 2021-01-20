const cron = require("node-cron");
const puppet = require("../../store/puppetFlipBoard");
const express = require("express");
const Routa = express.Router();
//

///
const Puppet = puppet.Scrapper;
let source = "https://flipboard.com/@espn";
const dataOne = new Puppet(source, "ESPN");

cron.schedule("0 3 * * *", () => {
  console.log("\x1b[46m%s\x1b[0m", "ESPN fired at:" + Date());
  dataOne.puppet();
});
//
Routa.get("/espn", (req, res) => {
  res.send({
    news: dataOne.processes,
  });
});
module.exports = Routa;

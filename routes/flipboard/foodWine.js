const cron = require("node-cron");
const puppet = require("../../store/puppetFlipBoard");
const express = require("express");
const Routa = express.Router();
//
let sources = {
  news: "https://flipboard.com/@foodandwine",
  recipe: "https://flipboard.com/@foodandwine/recipes-n1s9kfsoz",
};
//
const Puppet = puppet.Scrapper;
//one
const dataOne = new Puppet(sources.news, "foodandwine");
//two
const dataTwo = new Puppet(sources.recipe, "foodandwine");

//////
cron.schedule("0 */6 * * *", () => {
  console.log("\x1b[46m%s\x1b[0m", "FOODWINE fired at:" + Date());
  dataOne.puppet();
  dataTwo.puppet();
}); 

//
Routa.get("/foodwine", (req, res) => {
  res.send({
    foodWine: dataOne.processes,
    foodWineRecipes: dataTwo.processes,
  });
});
module.exports = Routa;

const puppeteer = require("puppeteer");
const puppet = require("../store/puppetSabc");
require("dotenv").config();
const generateUniqueId = require("generate-unique-id");
const cron = require("node-cron");
const wsChromeEndpointurl = require("../browser");
const helpers = require("../store/helpers");
const express = require("express");
const Routa = express.Router();
///
///
let processes = {
  main: {
    latest: {
      number: 0,
    },
    logs: [],
  },
  children: {
    latest: {
      number: 0,
    },
    logs: [],
  },
};
//
let add = [];

async function main(uri) {
  try {
    ////src
    //processes.source = uri;
    ///
    const browser = await puppeteer.connect({
      browserWSEndpoint: wsChromeEndpointurl,
      defaultViewport: null,
    });
    const page = await browser.newPage();
    page.setUserAgent(helpers.userAgent);
    await page.goto(uri, { waitUntil: "networkidle2", timeout: 0 });
    await page.waitForSelector(".ppc");
    const items = await page.$$(".ppc");
    await page.waitFor(30000);
    //
    for (const item of items) {
      try {
        // const left = await item.$('.right > .content > .article-synopsis.d-none.d-md-block');
        const cat = await item.$(".home_page_category > a");
        const image = await item.$(".category-image > img");
        const title = await item.$(".category-title > a");
        const images =
          image != null
            ? await item.$eval(".category-image > img", (img) => img.srcset)
            : null;
        //
        const thumbnail = await page.evaluate((img) => img.src, image);
        const date = await item.$eval(
          "p.ppc-first-post-date",
          (p) => p.innerText
        );
        const lede = await item.$eval(
          "p.ppc-first-post-excerpt",
          (p) => p.innerText
        );
        const category = await page.evaluate((a) => a.innerText, cat);
        const catLink = await page.evaluate((a) => a.href, cat);
        const url = await page.evaluate((a) => a.href, title);
        const headline = await page.evaluate((a) => a.innerText, title);
        //
        const iHtml = await page.evaluate((el) => el.innerHTML, item);
        let empty = null;
        const id = generateUniqueId({
          length: 32,
        });

        //
        let src_name = "SABC";
        let src_url = await page.evaluate(() => location.origin);
        let src_logo =
          "https://www.sabcnews.com/sabcnews/wp-content/uploads/2018/06/sabc-logo-white-final.png";
        let tag = category;
        let tags = empty;
        let author = empty;
        let authors = empty;
        let isVid = false;
        let vidLen = empty;
        //
        let key = empty;
        let label = empty;
        let type = "card";
        //
        let subject = empty;
        let format = empty;
        let about = empty;
        let data = {
          id,
          url,
          headline,
          lede,
          thumbnail,
          category,
          catLink,
          images,
          //
          key,
          label,
          //
          subject,
          format,
          about,
          //
          src_name,
          src_url,
          src_logo,
          //
          isVid,
          vidLen,
          //
          type,
          tag,
          tags,
          //
          author,
          authors,
          date,
        };
        await helpers.interfaceAPI(data);
        /////log
        let e = {
          current: helpers.timestamp(),
          error: null,
          data: JSON.stringify(data),
          number: processes.children.latest.number + 1,
        };
        processes.children.latest = e;
        processes.children.logs.push(e);
        ////
      } catch (error) {
        console.log("\x1b[42m%s\x1b[0m", `From ${uri} loop: ${error.message}`);
        /////log
        let e = {
          current: helpers.timestamp(),
          error: error.message,
          data: null,
          number: processes.children.latest.number + 1,
        };
        processes.children.latest = e;
        processes.children.logs.push(e);
        ////
        continue;
      }
    }
    //
    ////log
    let e = {
      current: helpers.timestamp(),
      error: null,
      number: processes.main.latest.number + 1,
    };
    processes.main.latest = e;
    processes.main.logs.push(e);
    ////
    console.log("\x1b[43m%s\x1b[0m", `Done: ${uri}`);
  } catch (error) {
    console.log("\x1b[41m%s\x1b[0m", `From ${uri} Main: ${error.message}`);
    ////log
    let e = {
      current: helpers.timestamp(),
      error: error.message,
      number: processes.main.latest.number + 1,
    };
    processes.main.latest = e;
    processes.main.logs.push(e);
    ///
  }
}
let sources = {
  business: "https://www.sabcnews.com/sabcnews/category/business/",
  politics: "https://www.sabcnews.com/sabcnews/category/politics/",
  science: "https://www.sabcnews.com/sabcnews/category/sci-tech/",
  sport: "https://www.sabcnews.com/sabcnews/category/sport/",
  world: "https://www.sabcnews.com/sabcnews/category/world/",
  news: "https://www.sabcnews.com/sabcnews/",
};
//source_business, , source_politics, source_science, source_sport, source_world
//
const Puppet = puppet.Scrapper;
//one
const dataOne = new Puppet(sources.politics, "politics");
//Two
const dataTwo = new Puppet(sources.business, "business");
//tthree
const dataThree = new Puppet(sources.science, "science");
//four
const dataFour = new Puppet(sources.sport, "sport");
//five
const dataFive = new Puppet(sources.world, "world");
///
cron.schedule("0 3 * * *", () => {
  console.log("\x1b[46m%s\x1b[0m", "SABC fired at:" + Date());
  main(sources.news);
  dataOne.puppet();
  dataTwo.puppet();
  dataThree.puppet();
  dataFour.puppet();
  dataFive.puppet();
});
//
Routa.get("/sabc", (req, res) => {
  res.send({
    processes,
    business: dataTwo.processes,
    politics: dataOne.processes,
    science: dataThree.processes,
    sport: dataFour.processes,
    world: dataFive.processes,
  });
});
module.exports = Routa;

const cron = require("node-cron");
const wsChromeEndpointurl = require("../browser");
const generateUniqueId = require("generate-unique-id");
const puppeteer = require("puppeteer");
require("dotenv").config();
const express = require("express");
const Routa = express.Router();
const puppet = require("../store/puppetEwn");
const helpers = require("../store/helpers");
//
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
async function main(uri_trending) {
  try {
    ////src
    processes.source = uri_trending;
    ///
    const browser = await puppeteer.connect({
      browserWSEndpoint: wsChromeEndpointurl,
      defaultViewport: null,
    });
    const page_trending = await browser.newPage();
    page_trending.setUserAgent(helpers.userAgent);
    await page_trending.goto(uri_trending, {
      waitUntil: "networkidle2",
      timeout: 0,
    });
    await page_trending.waitForSelector(".most-popular.track-mostpopular");
    const wrapper = await page_trending.$(".most-popular.track-mostpopular");
    const items_trending = await wrapper.$$("li");
    await page_trending.waitFor(5000);
    //
    for (const item of items_trending) {
      try {
        const url = await item.$eval("a", (a) => a.href);
        const headline = await item.$eval("a", (a) => a.innerText);
        let empty = null;
        let lede = empty;
        let thumbnail = empty;
        //
        let src_name = "EWN";
        let src_logo = "https://ewn.co.za/site/design/img/ewn-logo.png";
        let src_url = await page_trending.evaluate(() => location.origin);

        let category = "trends";
        let catLink = uri_trending;
        let tag = empty;
        let tags = empty;
        //
        //
        let images = empty;
        //
        let isVid = empty;
        let vidLen = empty;
        //
        let author = empty;
        let authors = empty;
        let date = empty;
        let type = "trend";
        let key = empty;
        let label = empty;
        //
        let subject = empty;
        let format = empty;
        let about = empty;

        const id = generateUniqueId({
          length: 32,
        });

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
          src_logo,
          src_name,
          src_url,
          //
          isVid,
          vidLen,
          //
          type,
          tag,
          tags,
          //
          date,
          author,
          authors,
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
        console.log("\x1b[42m%s\x1b[0m", `From ${uri_trending} loop: ${error.message}`);
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
    console.log("\x1b[43m%s\x1b[0m", `Done: ${uri_trending}`);
    await page_trending.close();
  } catch (error) {
    console.log("\x1b[41m%s\x1b[0m", `From ${uri_trending} Main: ${error.message}`);
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
  business: "https://ewn.co.za/categories/business",
  lifestyle: "https://ewn.co.za/categories/lifestyle",
  politics: "https://ewn.co.za/categories/politics",
  sport: "https://ewn.co.za/categories/sport",
  trending: "https://ewn.co.za/",
  spt2: "https://ewn.co.za/categories/sport?pagenumber=2&perPage=30",
};

const Puppet = puppet.Scrapper;
const dataOne = new Puppet(sources.business, "business");
const dataTwo = new Puppet(sources.lifestyle, "lifestyle");
const dataThree = new Puppet(sources.politics, "politics");
const dataFour = new Puppet(sources.sport, "sports");

cron.schedule("0 */6 * * *", () => {
  console.log("\x1b[46m%s\x1b[0m", "EWN fired at:" + Date());
  //One
  dataOne.puppet();
  //Two
  dataTwo.puppet();
  //three
  dataThree.puppet();
  //four
  dataFour.puppet();

  main(sources.trending);
});
//
Routa.get("/ewn", (req, res) => {
  res.send({
    news: dataOne.processes,
    lifestyle: dataTwo.processes,
    politics: dataThree.processes,
    sport: dataFour.processes,
    processes,
  });
});
module.exports = Routa;

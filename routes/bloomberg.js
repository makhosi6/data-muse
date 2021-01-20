require("dotenv").config();
const cron = require("node-cron");
const scrollPageToBottom = require("puppeteer-autoscroll-down");
const helpers = require("../store/helpers");
const express = require("express");
const Routa = express.Router();
const generateUniqueId = require("generate-unique-id");
const wsChromeEndpointurl = require("../browser");
const puppeteer = require("puppeteer");
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

async function main(uri) {
  try {
    ////src
    processes.source = uri;
    ///
    const browser = await puppeteer.connect({
      browserWSEndpoint: wsChromeEndpointurl,
      defaultViewport: null,
    });
    const page = await browser.newPage();
    await page.setViewport({
      width: 1920,
      height: 968,
    });
    page.setUserAgent(helpers.userAgent);
    await page.goto(uri, { waitUntil: "networkidle2", timeout: 0 });
    await page.waitForSelector(".story-package-module__story.mod-story");
    let myVar = setInterval(() => scrollPageToBottom(page), 100);
    await page.waitFor(12300);
    clearInterval(myVar);
    const items = await page.$$(".story-package-module__story.mod-story");
    //
    for (const item of items) {
      try {
        const get = await item.$(".bb-lazy-img__image");
        const f = await item.$("h3 > a");
        const time = await item.$("time");
        const cat = await item.$(".story-package-module__story__eyebrow > a");
        //
        const url = await page.evaluate((a) => a.href, f);
        const categori =
          cat != null || undefined
            ? await page.evaluate((a) => a.innerText, cat)
            : null;
        const catLink =
          cat != null || undefined
            ? await page.evaluate((a) => a.href, cat)
            : null;
        const headline = await item.$eval("h3 > a", (a) => a.innerText);
        const date =
          time != null || undefined
            ? await page.evaluate((time) => time.innerText, time)
            : null;
        const thumbnail =
          get != null || undefined
            ? await page.evaluate((img) => img.src, get)
            : null;
        //
        let empty = null;
        let lede = empty;
        let author = empty;
        let authors = empty;
        let src_logo = "https://www.conviva.com/wp-content/uploads/2019/12/Bloomberg-logo-.png";
        let src_name = "Bloomberg";
        let vidLen = empty;
        let isVid = false;
        let src_url = await page.evaluate(() => location.origin);
        let images = empty;
        let type = "title-only";
        const id = generateUniqueId({
          length: 32,
        });
        let category = "africa";
        let tag = categori;
        //
        let key = empty;
        let tags = empty;
        let label = empty;
        //
        let subject = empty;
        let format = empty;
        let about = empty;
        //
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
          number: (processes.children.latest.number+1),
        };
        processes.children.latest = e;
        processes.children.logs.push(e);
        ////
      } catch (error) {
        console.log("\x1b[42m%s\x1b[0m", `From ${uri} loop: ${error}`);
        /////log
        let e = {
          current: helpers.timestamp(),
          error: error.message,
          data: null,
          number: (processes.children.latest.number+1),
        };
        processes.children.latest = e;
        processes.children.logs.push(e);
        ////
        continue;
      }
    }
    ////log
    let e = {
      current: helpers.timestamp(),
      error: null,
      number: (processes.main.latest.number+1),
    };
    processes.main.latest = e;
    processes.main.logs.push(e);
    ////
    await page.close();
    console.log("\x1b[43m%s\x1b[0m", `Done: ${uri}`);
  } catch (error) {
    console.log("\x1b[41m%s\x1b[0m", `From ${uri} Main: ${error}`);
    ////log
    let e = {
      current: helpers.timestamp(),
      error: error.message,
      number: (processes.main.latest.number+1),
    };

    processes.main.latest = e;
    processes.main.logs.push(e);
    ///
  }
}
let source = "https://www.bloomberg.com/africa";

cron.schedule("0 3 * * *", () => {
  console.log("\x1b[46m%s\x1b[0m", "BLOOMBERG fired at:" + Date());
  main(source);
});
//
console.log("\x1b[46m%s\x1b[0m", "BLOOMBERG fired at:" + Date());
main(source).then(main(source)).then(main('https://www.bloomberg.cdom/afrdica'));
//
Routa.get("/bloomberg", (req, res) => {
  res.send({
    processes,
  });
});
module.exports = Routa;

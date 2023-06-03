const cron = require("node-cron");
require("dotenv").config();
const generateUniqueId = require("generate-unique-id");
const wsChromeEndpointurl = require("../browser");
const puppeteer = require("puppeteer");
const helpers = require("../store/helpers");
const express = require("express");
const Routa = express.Router();
///

//
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
let src_name = "CGTN";
async function main(uri_cgtn) {
  try {
    ////src
    processes.source = uri_cgtn;
    ///
    const browser = await puppeteer.connect({
      browserWSEndpoint: wsChromeEndpointurl,
      defaultViewport: null,
    });
    const page_cgtn = await browser.newPage();
    page_cgtn.setUserAgent(helpers.userAgent);
    await page_cgtn.goto(uri_cgtn, { waitUntil: "networkidle2", timeout: 0 });
    await page_cgtn.waitForSelector(".cg-newsWrapper");
    await page_cgtn.waitFor(12300);
    const items_cgtn = await page_cgtn.$$(".cg-newsWrapper");
    console.log(items_cgtn.length);
    for (const item of items_cgtn) {
      try {
        //
        const image = await item.$(".cg-pic > a > img");
        const hed = await item.$("h4 > a");
        const time = await item.$(".cg-time");
        const cat = await item.$(".cg-newsCategory");
        const para = await item.$(".cg-content");
        //
        let vid = await item.$(".video-play-time");
        let vidLen =
          vid !== null
            ? await vid.evaluate((div) => div.innerText, ".ng-duration-time")
            : null;
        let isVid = vid !== null || vid !== undefined ? true : false;
        //
        const url =
          hed !== null ? await page_cgtn.evaluate((a) => a.href, hed) : null;
        const categoryA =
          cat != null || undefined
            ? await page_cgtn.evaluate((section) => section.textContent, cat)
            : null;
        const headlineA = await item.$eval("h4 > a", (a) => a.innerText);
        const dateA =
          time != null || undefined
            ? await page_cgtn.evaluate((time) => time.innerText, time)
            : null;
        const lede =
          para != null || undefined
            ? await page_cgtn.evaluate((div) => div.innerText, para)
            : null;
        const thumbnail =
          image != null || undefined
            ? await page_cgtn.evaluate((img) => img.src, image)
            : null;
        //
        let date = dateA != null ? dateA.trim() : dateA;
        let category = categoryA != null ? categoryA.trim() : categoryA;
        let headline = headlineA != null ? headlineA.trim() : headlineA;
        //
        let empty = null;
        let src_url = await page_cgtn.evaluate(() => location.origin);

        const id = generateUniqueId({
          length: 32,
        });
        //
        let key = empty;
        let label = empty;
        let type =
          thumbnail !== null || thumbnail !== undefined
            ? "card"
            : "strip";
        //
        let subject = empty;
        let format = empty;
        let about = empty;
        //
        let catLink = empty;
        let tag = category;
        let author = empty;
        let authors = empty;
        let tags = empty;

        let images = empty;
        let src_logo =
          "https://ui.cgtn.com/static/ng/resource/images/icon/logo@3x.png";
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
        //
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
        console.log("\x1b[42m%s\x1b[0m", `From ${uri_cgtn} loop: ${error.message}`);
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
    await page_cgtn.close();
    console.log("\x1b[43m%s\x1b[0m", `Done: ${uri_cgtn}`);
  } catch (error) {
    console.log("\x1b[41m%s\x1b[0m", `From ${uri_cgtn} Main: ${error.message}`);
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
let source_cgtn = "https://www.cgtn.com/";

cron.schedule("0 */6 * * *", () => {
  console.log("\x1b[46m%s\x1b[0m", "CGTN fired at:" + Date());
  main(source_cgtn);
}); 
/////
Routa.get("/cgtn", (req, res) => {
  res.send({
  processes
  });
});
module.exports = Routa;

const cron = require("node-cron");
const puppeteer = require("puppeteer");
require("dotenv").config();
const generateUniqueId = require("generate-unique-id");
const wsChromeEndpointurl = require("../browser");
const helpers = require("../store/helpers");
const express = require("express");
const Routa = express.Router();
///
let src_name = "Africanews";
let src_logo =
  "https://www.screenafrica.com/wp-content/uploads/2018/04/Africanews-logo.png";
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
    page.setUserAgent(helpers.userAgent);
    await page.goto(uri, { waitUntil: "networkidle2", timeout: 0 });
    await page.waitFor(125000);
    await page.waitForSelector("article");
    const emAll = await page.$$("article.just-in__article");

    for (const each of emAll) {
      try {
        const time = await each.$("time");
        const ab = await each.$("a");
        const d =
          time != null || undefined
            ? await page.evaluate((i) => i.textContent, time)
            : null;
        const date = await d.replace(/(\r\n|\n|\r)/gm, "").trim();
        //
        const type = "trend";
        const h1 = await each.$eval("h3 > a", (a) => a.innerText);
        const headline = await h1.replace(/(\r\n|\n|\r)/gm, "").trim();
        let src_url = await page.evaluate(() => location.origin);
        //
        const url = await page.evaluate((a) => a.href, ab);
        const empty = null;
        //

        const id = generateUniqueId({
          length: 32,
        });
        let lede = empty;
        let thumbnail = empty;
        let category = empty;
        let catLink = empty;
        let images = empty;
        //
        let key = empty;
        let label = empty;
        //
        let subject = empty;
        let format = empty;
        let about = empty;

        let isVid = false;
        let vidLen = empty;
        //
        let tag = empty;
        let tags = empty;
        //
        let author = empty;
        let authors = empty;
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
          number: processes.children.latest.number + 1,
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
          number: processes.children.latest.number + 1,
        };
        processes.children.latest = e;
        processes.children.logs.push(e);
        ////
      }
    }
    //
    const items = await page.$$("article.teaser");
    //
    for (const item of items) {
      try {
        //
        const timeStamp = await item.$(".boxPlay--duration");
        const e = await item.$("img");
        const f = await item.$(".teaser__title");
        const time = await item.$("time");
        //
        const url = await page.evaluate((a) => a.href, item);
        const head = await item.$eval(".teaser__title", (a) => a.textContent);
        const d =
          time != null || undefined
            ? await page.evaluate((i) => i.textContent, time)
            : null;
        const date = d !== null ? await d.trim() : null;

        const thumbnail =
          e != null || undefined
            ? await item.$eval("img", (img) => img.src)
            : null;
        const vidLen =
          timeStamp != null || undefined
            ? await page.evaluate((a) => a.innerText, timeStamp)
            : null;
        const isVid = timeStamp != null || undefined ? true : false;
        //
        let type = thumbnail === null ? "title-only" : "strip";
        let headline = head.trim();
        const iHtml = await page.evaluate((el) => el.innerHTML, item);
        let src_url = await page.evaluate(() => location.origin);
        let empty = null;

        const id = generateUniqueId({
          length: 32,
        });
        let lede = empty;
        let tag = empty;
        let tags = empty;
        let category = empty;
        let catLink = empty;
        let images = empty;
        //
        let author = empty;
        let authors = empty;
        let key = empty;
        let label = empty;
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
        console.log("\x1b[42m%s\x1b[0m", `From ${uri} loop: ${error}`);
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
    await page.close();
    console.log("\x1b[43m%s\x1b[0m", `Done: ${uri}`);
  } catch (error) {
    console.log("\x1b[41m%s\x1b[0m", `From ${uri} Main: ${error}`);
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
let source = "https://www.africanews.com/";

cron.schedule("0 */6 * * *", () => {
  console.log("\x1b[46m%s\x1b[0m", "Africanews fired at:" + Date());
  main(source);
});
/////
Routa.get("/africa", (req, res) => {
  res.send({
    processes,
  });
});
module.exports = Routa;

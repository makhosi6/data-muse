const cron = require("node-cron");
const wsChromeEndpointurl = require("../browser");
const puppeteer = require("puppeteer");
const generateUniqueId = require("generate-unique-id");
require("dotenv").config();
const helpers = require("../store/helpers");
const express = require("express");
const Routa = express.Router();
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
let src_name = "M&G";

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
    await page.goto(uri, {
      waitUntil: "networkidle2",
      timeout: 0,
    });
    await page.waitForSelector(".td_module_flex");
    const items = await page.$$(".td_module_flex");
    await page.waitFor(15000);
    //
    for (const item of items) {
      try {
        // const left = await item.$('.right > .content > .article-synopsis.d-none.d-md-block');
        const get = await item.$(".td-image-wrap");
        const ea = await item.$(".td-image-wrap > span");
        x = await page.evaluate((el) => el.innerHTML, item);
        const f = await item.$("h3 > a");
        const time = await item.$("time");
        const cred = await item.$(".td-post-author-name > a");
        const para = await item.$(".td-excerpt");
        const cat = await item.$(".td-post-category");
        //
        const thumb =
          (await page.evaluate((a) => a.style.backgroundImage, ea)) ||
          (await item.$eval(".td-image-wrap > span", (img) => img.dataset.bg));
        let a;
        let b;
        let c;
        let thumbnail;
        if (thumb.includes('url("')) {
          a =
            thumb !== null || thumb !== undefined ? thumb.split('url("') : null;
          b = a[1];
          c = thumb !== null || thumb !== undefined ? b.split('")') : null;
          thumbnail = thumb !== null ? c[0] : null;
        } else {
          thumbnail = thumb;
        }

        const author =
          cred != null || undefined
            ? await page.evaluate((a) => a.innerText, cred)
            : null;
        const date =
          time != null || undefined
            ? await page.evaluate((time) => time.innerText, time)
            : null;
        const url = await page.evaluate((a) => a.href, get);
        const headline = await item.$eval("h3 > a", (span) => span.innerText);
        const lede =
          para != null || undefined
            ? await item.$eval(".td-excerpt", (div) => div.innerText)
            : null;
        const tag =
          cat != null || undefined
            ? await item.$eval(".td-post-category", (a) => a.innerText)
            : null;
        //
        let src_logo =
          "https://bucket.mg.co.za/wp-media/2020/01/74e543ae-logo-white-467.png";

        let src_url = await page.evaluate(() => location.origin);
        const id = generateUniqueId({
          length: 32,
        });

        let empty = null;

        let catLink = empty;
        let category = "news";
        let images = empty;
        let authors = empty;
        //
        let isVid = false;
        let vidLen = empty;
        //
        let key = empty;
        let tags = empty;
        let label = empty;
        let type =
          thumb !== null && thumb !== undefined ? "card" : "strip";
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
    await page.close();
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
let source = "https://mg.co.za/";

cron.schedule("0 */6 * * *", () => {
  console.log("\x1b[46m%s\x1b[0m", "M&G fired at:" + Date());
  main(source);
}); 
//
Routa.get("/mg/news", (req, res) => {
  res.send({
    processes,
  });
});
module.exports = Routa;

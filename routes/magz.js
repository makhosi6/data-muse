const wsChromeEndpointurl = require("../browser");
const puppeteer = require("puppeteer");
const cron = require("node-cron");
require("dotenv").config();
const scrollPageToBottom = require("puppeteer-autoscroll-down");
const generateUniqueId = require("generate-unique-id");
const helpers = require("../store/helpers");
const express = require("express");
const Routa = express.Router();
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
let category = "lifestyle";

async function main(uri_men, uri_women, uri_vogue, uri_you) {
  try {
    ////src
    processes.source = uri_men;
    ///
    const browser = await puppeteer.connect({
      browserWSEndpoint: wsChromeEndpointurl,
      defaultViewport: null,
    });
    const page_men = await browser.newPage();
    page_men.setUserAgent(helpers.userAgent);
    await page_men.goto(uri_men, { waitUntil: "networkidle2", timeout: 0 });
    await page_men.waitForSelector("article.post");
    let myVar = setInterval(() => scrollPageToBottom(page_men), 200);
    await page_men.waitFor(1500);
    clearInterval(myVar);
    await page_men.waitFor(5000);
    ///
    const items_men = await page_men.$$("article.post");
    //
    for (const item of items_men) {
      try {
        const get = await item.$("div.uk-cover-background.uk-position-cover");
        const cat = await item.$(".uk-badge");
        //
        const url = await item.$eval(".uk-panel-title", (a) => a.href);
        const headline = await item.$eval(
          ".uk-panel-title",
          (a) => a.innerText
        );
        const tag =
          cat != null || undefined
            ? await page_men.evaluate((a) => a.innerText, cat)
            : null;
        const thumb = await page_men.evaluate(
          (div) => div.style.backgroundImage,
          get
        );
        //
        let a = thumb.split('url("');
        let b = a[1];
        let c = b.split('")');
        let thumbnail = c[0];
        const iHtml = await page_men.evaluate((el) => el.innerHTML, cat);
        //
        let empty = null;
        const id = generateUniqueId({
          length: 32,
        });
        let src_logo =
          "https://upload.wikimedia.org/wikipedia/commons/8/8b/Men%27s_Health.svg";
        //
        let src_url = await page_men.evaluate(() => location.origin);
        let catLink = uri_men;
        let tags = empty;
        //
        let images = empty;
        //
        let isVid = false;
        let vidLen = empty;
        //
        let src_name = "men health";
        let type = "card";
        let date = empty;
        let author = empty;
        let authors = empty;
        let lede = empty;
        //
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
        console.log("\x1b[42m%s\x1b[0m", `From ${uri_men} loop: ${error}`);
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

    const page_women = await browser.newPage();
    page_women.setUserAgent(helpers.userAgent);
    await page_women.goto(uri_women, { waitUntil: "networkidle2", timeout: 0 });
    await page_women.waitForSelector("article.post");
    let myVar_women = setInterval(() => scrollPageToBottom(page_women), 100);
    await page_women.waitFor(1500);
    clearInterval(myVar_women);
    await page_women.waitFor(15000);
    const items_women = await page_women.$$("article.post");
    for (const item of items_women) {
      try {
        //
        const get = await item.$("div.uk-cover-background.uk-position-cover");
        const cat = await item.$(".uk-badge");
        //
        const url = await item.$eval(".uk-panel-title", (a) => a.href);
        const headline = await item.$eval(
          ".uk-panel-title",
          (a) => a.innerText
        );
        const tag =
          cat != null || undefined
            ? await page_women.evaluate((a) => a.innerText, cat)
            : null;
        const thumb = await page_women.evaluate(
          (div) => div.style.backgroundImage,
          get
        );
        //
        let a = thumb.split('url("');
        let b = a[1];
        let c = b.split('")');
        let thumbnail = c[0];
        const iHtml = await page_women.evaluate((el) => el.innerHTML, cat);
        let empty = null;
        const id = generateUniqueId({
          length: 32,
        });
        let src_logo =
          "https://www.womenshealthsa.co.za/wp-content/uploads/2018/01/wh-logo.svg";
        //
        let catLink = empty;
        let tags = empty;
        //
        let images = empty;
        //
        let author = empty;
        let authors = empty;
        let src_url = await page_women.evaluate(() => location.origin);
        let src_name = "womens health";
        let date = empty;
        let lede = empty;
        //
        let type = "card";

        let vidLen = empty;
        let isVid = false;
        let key = empty;
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
        ////log
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
        console.log("\x1b[42m%s\x1b[0m", `From ${uri_women} loop: ${error}`);
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
    const page_vogue = await browser.newPage();
    page_vogue.setUserAgent(helpers.userAgent);
    await page_vogue.goto(uri_vogue, { waitUntil: "networkidle2", timeout: 0 });
    await page_vogue.waitForSelector('[data-test-id="TeaserBasic"]');
    const items_vogue = await page_vogue.$$('[data-test-id="TeaserBasic"]');
    await page_vogue.waitFor(15000);
    ////
    for (const item of items_vogue) {
      try {
        let src_url = await page_vogue.evaluate(() => location.origin);
        const anchor = await item.$('[data-test-id="Anchor"]');
        const image = await item.$('[data-test-id="Img"]');
        const imageTwo = await item.$("noscript");
        const head = await item.$('[data-test-id="Hed"]');
        const name = await item.$('[data-test-id="Name"]');
        const cat = await item.$('[data-test-id="KickerText"]');
        //

        const thumb =
          image != null || undefined
            ? await page_vogue.evaluate((img) => img.src, image)
            : await page_vogue.evaluate((img) => img.innerHTML, imageTwo);
        const url =
          anchor != null || undefined
            ? await page_vogue.evaluate((a) => a.href, anchor)
            : null;
        const headline =
          head != null || undefined
            ? await page_vogue.evaluate((p) => p.innerText, head)
            : null;
        const tag =
          cat != null || undefined
            ? await page_vogue.evaluate((p) => p.innerText, cat)
            : null;
        const author =
          name != null || undefined
            ? await page_vogue.evaluate((p) => p.innerText, name)
            : null;
        //
        const id = generateUniqueId({
          length: 32,
        });
        let a = image == null ? thumb.split('src="') : null;
        let b = image == null ? a[1] : null;
        let c = image == null ? b.split('" srcSet="') : null;
        let d = image == null ? c[0] : null;
        let thumbnail = d == null ? thumb : d;
        //
        let empty = null;
        let type = "card";

        let src_logo =
          "https://img.favpng.com/24/11/2/vogue-logo-magazine-fashion-png-favpng-H83cmbUdKYE8XPb1rZtiVg4j8.jpg";
        //
        let date = empty;
        let catLink = empty;
        //
        let src_name = "vogue";
        let images = empty;
        //
        let isVid = false;
        let vidLen = empty;
        //
        let authors = empty;
        let tags = empty;
        let key = empty;

        let label = empty;
        //
        let subject = empty;
        let format = empty;
        let about = empty;

        let lede = empty;
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
        //
      } catch (error) {
        console.log("\x1b[42m%s\x1b[0m", `From ${uri_vogue} loop: ${error}`);
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
    const page_you = await browser.newPage();
    page_you.setUserAgent(helpers.userAgent);
    await page_you.goto(uri_you, { waitUntil: "networkidle2", timeout: 0 });
    await page_you.waitForSelector("article");

    await page_you.waitFor(5000);
    let src_url = await page_you.evaluate(() => location.origin);

    //
    await page_you.waitFor(15000);
    const items_you = await page_you.$$("article.article_item");
    //
    for (const item of items_you) {
      try {
        //
        const image = await item.$(".article-item__image > img");
        const title = await item.$(".article-item__title > span");
        //
        const url = await item.$eval("a.article-item--url", (a) => a.href);
        const thumbnail = await page_you.evaluate((img) => img.src, image);
        const date = await item.$eval(
          "p.article-item__date",
          (p) => p.innerText
        );
        const headline = await page_you.evaluate((a) => a.innerText, title);
        //
        let empty = null;
        const id = generateUniqueId({
          length: 32,
        });
        let src_logo =
          "https://pbs.twimg.com/profile_images/463234912493907968/HxL6FPIG_400x400.jpeg";
        //
        let src_name = "YOU";
        let tag = empty;
        let tags = empty;
        let type = "card";
        let catLink = uri_you;
        //
        let images = empty;
        //
        let isVid = false;
        let vidLen = empty;
        let author = empty;
        let authors = empty;

        let key = empty;
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
          number: processes.children.latest.number + 1,
        };
        processes.children.latest = e;
        processes.children.logs.push(e);
        ////
      } catch (error) {
        console.log("\x1b[42m%s\x1b[0m", `From ${uri_you} loop: ${error}`);
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
    console.log("\x1b[43m%s\x1b[0m", `Done: ${uri_you}`);
    //
    await page_men.close();
    await page_women.close();
    await page_you.close();
    await page_vogue.close();

    //
  } catch (error) {
    console.log("\x1b[41m%s\x1b[0m", `From ${uri_you} Main: ${error}`);
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
let source_men = "https://www.mh.co.za/";
let source_women = "https://www.womenshealthsa.co.za/";
let source_vogue = "https://www.vogue.co.uk/";
let source_you = "https://www.news24.com/You";
///
cron.schedule("0 4 * * SUN", () => {
  console.log("\x1b[46m%s\x1b[0m", "MAGZ fired at:" + Date());
  main(source_men, source_women, source_vogue, source_you);
}); 
//

Routa.get("/magz-lifestyle", (req, res) => {
  res.send({
    processes
  });
});
module.exports = Routa;

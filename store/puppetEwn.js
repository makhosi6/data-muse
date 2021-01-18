const vars = require("./storeVars");
const puppeteer = require("puppeteer");
const generateUniqueId = require("generate-unique-id");
const wsChromeEndpointurl = require("../browser");
//
class Scrapper {
  constructor(uri, category) {
    this.uri = uri;
    this.category = category;
    this.data = [];
  }
  async puppet() {
    try {
      const browser = await puppeteer.connect({
        browserWSEndpoint: wsChromeEndpointurl,
        defaultViewport: null,
      });
      const page = await browser.newPage();
      page.setUserAgent(vars.userAgent);
      await page.goto(this.uri, { waitUntil: "networkidle2", timeout: 0 });
      await page.waitForSelector(".article-short");
      const items = await page.$$(".article-short");
      await page.waitFor(5000);
      let arrr = [];
      for (const item of items) {
        try {
          const check = await item.$(".thumb");
          const left = await item.$(".left");
          if (check == null && left == null) {
            const h1 = await item.$("h4");
            const image = await item.$("img");
            const thumbnail =
              image != null || undefined
                ? await item.$eval("img", (img) => img.src)
                : null;
            const url = await h1.$eval("a", (a) => a.href);
            //
            const headline = await h1.$eval("a", (a) => a.innerText);
            //

            const para = await item.$("p.lead");
            const lede =
              para != null || undefined
                ? await item.$eval("p", (p) => p.innerText)
                : null;
            const date = await item.$eval("abbr", (abbr) => abbr.innerText);
            let src_logo = "https://ewn.co.za/site/design/img/ewn-logo.png";
            let src_name = "EWN";
            let src_url = await page.evaluate(() => location.origin);
            let type = "card";
            let empty = null;

            const id = generateUniqueId({
              length: 32,
            });

            //
            let images = empty;
            let category = this.category;
            let tag = empty;
            let tags = empty;
            let catLink = this.uri;
            let author = empty;
            let authors = empty;
            let vidLen = empty;
            let isVid = false;
            let key = empty;
            let label = empty;
            //
            let subject = empty;
            let format = empty;
            let about = empty;
            await vars.interfaceAPI({
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
              author,
              authors,
              date,
            });
          }
        } catch (error) {
          console.log("\x1b[42m%s\x1b[0m", `From ${this.uri} loop: ${error}`);
          continue;
        }
      }
      //
      this.data = arrr;
      await page.close();
      console.log("\x1b[43m%s\x1b[0m", `Done: ${this.uri}`);
    } catch (error) {
      console.log("\x1b[41m%s\x1b[0m", `From ${this.uri} Main: ${error}`);
    }
  }
}

module.exports = {
  Scrapper: Scrapper,
};

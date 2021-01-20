const puppeteer = require("puppeteer");
const generateUniqueId = require("generate-unique-id");
const wsChromeEndpointurl = require("../browser");
const helpers = require("./helpers");
//
let src_name = "SABC";
//
class Scrapper {
  constructor(uri, cat) {
    this.uri = uri;
    this.cat = cat;
    this.processes = {
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
  }
  async puppet() {
    try {
      ////src
      this.processes.source = uri;
      //
      const browser = await puppeteer.connect({
        browserWSEndpoint: wsChromeEndpointurl,
        defaultViewport: null,
      });
      const page = await browser.newPage();
      page.setUserAgent(helpers.userAgent);
      await page.goto(this.uri, { waitUntil: "networkidle2", timeout: 0 });
      await page.waitFor(30000);
      await page.waitForSelector(".sabc_cat_list_item");
      const items = await page.$$(".sabc_cat_list_item");
      await page.waitFor(5000);

      //
      for (const item of items) {
        try {
          const image = await item.$(".sabc_cat_list_item_image > img");
          const title = await item.$(".sabc_cat_list_item_title > a");
          const images =
            image != null
              ? await item.$eval(
                  ".sabc_cat_list_item_image > img",
                  (img) => img.srcset
                )
              : null;
          //sabc_cat_item_date
          const thumbnail = await page.evaluate((img) => img.src, image);
          const date = await item.$eval(
            ".sabc_cat_item_date",
            (span) => span.innerText
          );
          const lede = await item.$eval(
            ".sabc_cat_list_item_summary",
            (p) => p.innerText
          );
          const url = await page.evaluate((a) => a.href, title);
          const headline = await page.evaluate((a) => a.innerText, title);
          //
          const iHtml = await page.evaluate((el) => el.innerHTML, item);
          let category = this.cat;
          let empty = null;
          const id = generateUniqueId({
            length: 32,
          });
          //
          let catLink = empty;
          let src_url = await page.evaluate(() => location.origin);
          let src_logo =
            "https://www.sabcnews.com/sabcnews/wp-content/uploads/2018/06/sabc-logo-white-final.png";
          let tag = empty;
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
          //

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
            number: this.processes.children.latest.number + 1,
          };
          this.processes.children.latest = e;
          this.processes.children.logs.push(e);
          ////
        } catch (error) {
          console.log("\x1b[42m%s\x1b[0m", `From ${this.uri} loop: ${error}`);
          /////log
          let e = {
            current: helpers.timestamp(),
            error: error.message,
            data: null,
            number: this.processes.children.latest.number + 1,
          };
          this.processes.children.latest = e;
          this.processes.children.logs.push(e);
          ////
          continue;
        }
      }
      //
      ////log
      let e = {
        current: helpers.timestamp(),
        error: null,
        number: this.processes.main.latest.number + 1,
      };
      this.processes.main.latest = e;
      this.processes.main.logs.push(e);
      ////
      await page.close();
      console.log("\x1b[43m%s\x1b[0m", `Done: ${this.uri}`);
    } catch (error) {
      console.log("\x1b[41m%s\x1b[0m", `From ${this.uri} Main: ${error}`);
      ////log
      let e = {
        current: helpers.timestamp(),
        error: error.message,
        number: this.processes.main.latest.number + 1,
      };

      this.processes.main.latest = e;
      this.processes.main.logs.push(e);
      ///
    }
  }
}

module.exports = {
  Scrapper: Scrapper,
};

const helpers = require("./helpers");
const puppeteer = require("puppeteer");
const generateUniqueId = require("generate-unique-id");
const wsChromeEndpointurl = require("../browser");

//
let src_name = "Wired";
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
      this.processes.source = this.uri;
      //
      const browser = await puppeteer.connect({
        browserWSEndpoint: wsChromeEndpointurl,
        defaultViewport: null,
      });
      const page = await browser.newPage();
      page.setUserAgent(helpers.userAgent);
      await page.goto(this.uri, { waitUntil: "networkidle2", timeout: 0 });
      await page.waitForSelector(".card-component ul");
      const items = await page.$$(".card-component ul");
      await page.waitFor(5000);
      //

      for (const item of items) {
        try {
          const thumbnail = await item.$eval("img", (img) => img.src);
          const url = await item.$eval("a", (a) => a.href);
          const headline = await item.$eval("h2", (h2) => h2.innerText);
          const author = await item.$eval(
            "a.byline-component__link",
            (a) => a.innerText
          );
          const tag = await item.$eval(
            "span.brow-component--micro",
            (span) => span.innerText
          );

          let empty = null;
          let tags = empty;
          let authors = empty;
          let category = this.cat;
          let lede = empty;
          let images = empty;
          let src_url = await page.evaluate(() => location.origin);
          let date = empty;
          let isVid = false;
          let vidLen = empty;
          let catLink = this.uri;
          let src_logo = "https://www.wired.com/images/icons/logo-black.svg";
          //
          const id = generateUniqueId({
            length: 32,
          });

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
            number: this.processes.children.latest.number + 1,
          };
          this.processes.children.latest = e;
          this.processes.children.logs.push(e);
          ////
        } catch (error) {
          console.log("\x1b[42m%s\x1b[0m", `From ${this.uri} loop: ${error.message}`);
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
      console.log("\x1b[41m%s\x1b[0m", `From ${this.uri} Main: ${error.message}`);
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

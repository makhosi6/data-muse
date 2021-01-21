const helpers = require("./helpers");
const puppeteer = require("puppeteer");
const generateUniqueId = require("generate-unique-id");
const wsChromeEndpointurl = require("../browser");
//

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
      await page.setViewport({
        width: 1920,
        height: 968,
      });

      page.setUserAgent(helpers.userAgent);
      await page.goto(this.uri, { waitUntil: "networkidle2", timeout: 0 });
      await page.waitForSelector(".item-list");
      const items = await page.$$(".post__section-item-display");

      let src_logo = "";
      //
      for (let i = 0; i < items.length; i++) {
        try {
          console.log({ src_logo });
          const empty = null;
          await page.goto(this.uri, {
            waitUntil: "networkidle2",
            timeout: 0,
          });
          await page.waitForSelector(".item-list");
          const items = await page.$$(".post__section-item-display");
          const item = items[i];
          const title = await item.$(".post__title");
          //
          const id = generateUniqueId({
            length: 32,
          });
          // await page.evaluate((el) => el.scrollIntoView(), item);
          const para = await item.$(".post__excerpt");

          const thumbnail = await item.$eval("img", (img) => img.src);
          // await page.waitForSelector('.image--loaded');

          const headline = await title.$eval(
            "a.internal-link",
            (a) => a.innerText
          );
          const url = await title.$eval("a.internal-link", (a) => a.href);
          const tagEl = await item.$("a.topic-tag");
          const tag =
            tagEl != null || undefined
              ? await item.$eval("a.topic-tag", (a) => a.innerText)
              : null;
          const cred = await item.$(".post-attribution__source");
          const source =
            cred != null || undefined
              ? await cred.$eval("a", (a) => a.innerText)
              : null;
          let src_name = await page.$eval(
            ".post-attribution__author.internal-link",
            (x) => x.innerText
          );
          const lede = await para.$eval("a", (a) => a.innerText);
          const date = await item.$eval("time", (time) => time.innerText);
          //
          const author = source.replace(" and ", " & ");
          const next = await item.$(".post__title > a");
          next.click();
          await page.waitFor(3000);
          await page.waitForSelector(".post__read-more");
          //
          const x = await item.$(".author-avatar__image.image--loaded");
          //
          if (x !== null) {
            src_logo = await item.$eval(
              ".author-avatar__image.image--loaded",
              (img) => img.src
            );
          }

          let button = await page.$x(
            '//*[@id="content"]/div/main/div/div/div[1]/div/div[2]'
          );
          let ellen = await page.waitForSelector(".post__read-more");
          const src_url =
            button != null || undefined
              ? await ellen.$eval("a", (a) => a.href)
              : null;

          //
          let type = "card";
          let category = this.cat;
          let key = empty;
          let label = empty;
          //
          let authors = empty;
          let subject = empty;
          let format = empty;
          let about = empty;
          let tags = empty;
          //
          let images = empty;
          let catLink = this.uri;
          let vidLen = empty;
          let isVid = false;
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

const express = require("express");
const puppeteer = require("puppeteer");
const helpers = require("./helpers");
const generateUniqueId = require("generate-unique-id");

const wsChromeEndpointurl = require("../browser");
//
let src_name = "CNN";
class Scrapper {
  constructor(uri, category) {
    this.uri = uri;
    this.category = category;
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
      await page.waitForSelector(".cd__wrapper");
      const items = await page.$$(".cd__wrapper");
      //

      await page.waitFor(5000);
      for (const item of items) {
        try {
          const sub = await item.$(".cd__content");
          // CATEGORY
          const subText = await sub.$eval("h3", (h3) => h3.dataset.analytics);
          const str = await subText.split("_");
          const first = await str[0];
          const sec = await str[2];
          const c = first != "" ? await first : null;
          const isVid = sec == "video" ? true : false;
          //VALUES
          const head = await item.$(".cd__headline");
          const media = await item.$(".media");
          //
          const headline = await head.$eval("span", (span) => span.innerText);
          const url = await head.$eval("a", (a) => a.href);
          const mediaLink =
            media != null || undefined
              ? await media.$eval("a", (a) => a.href)
              : null;
          const image =
            media != null || undefined ? await media.$(".media__image") : null;
          const thumbnail =
            (media != null || undefined) && (image != null || undefined)
              ? await media.$eval("img", (img) => img.dataset.src)
              : null;
          let j = await item.$(".cnn-badge-icon");

          const src_logo =
            "https://dnh0aphdpud22.cloudfront.net/social_avatars/f709e3e81b14933db09763a3.jpg";

          let empty = null;

          let tag = c == null || undefined ? this.cat : c;

          const id = generateUniqueId({
            length: 32,
          });

          let category = this.category;
          let lede = empty;
          let tags = empty;
          let key = empty;
          let label = empty;
          //
          let subject = empty;
          let format = empty;
          let about = empty;
          let type = "card";
          let date = empty;
          let author = empty;
          let authors = empty;
          let vidLen = empty;
          let catLink = this.uri;
          let src_url = await page.evaluate(() => location.origin);
          let images = empty;
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
            src_logo,
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
          let e = {
            current: helpers.timestamp(),
            error: error.message,
            data: null,
            number: this.processes.children.latest.number + 1,
          };
          this.processes.children.latest = e;
          this.processes.children.logs.push(e);
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

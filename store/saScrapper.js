const express = require("express");
const puppeteer = require("puppeteer");
const vars = require("./storeVars");
const generateUniqueId = require("generate-unique-id");
const wsChromeEndpointurl = require("../browser");
//

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
      await page.goto(this.uri, {
        waitUntil: "networkidle2",
        timeout: 0,
      });
      await page.waitForSelector(".jeg_post");
      const items = await page.$$(".jeg_posts > .jeg_post");
      //
      let arrr = [];
      for (const item of items) {
        try {
          const iHtml = await page.evaluate((el) => el.innerHTML, item);
          //
          const head = await item.$("h3.jeg_post_title");
          const time = await item.$(".jeg_meta_date");
          const publisher = await item.$(".jeg_meta_author");
          const cat = await item.$(".jeg_post_category");
          const catB = await item.$(".jeg_post_category a");
          const wrapper = await item.$(".jeg_thumb");
          //
          const url =
            head != null || undefined
              ? await head.$eval("a", (a) => a.href)
              : null;

          const headline =
            head != null || undefined
              ? await head.$eval("a", (a) => a.innerText)
              : null;
          const thumbnail =
            wrapper != null || undefined
              ? await item.$eval("img", (img) => img.dataset.src)
              : null;
          const p = await item.$("p");
          const lede =
            p === null ? null : await page.evaluate((p) => p.innerHTML, p);
          let type = lede === null ? "strip" : "card";
          const author =
            publisher != null || undefined
              ? await publisher.$eval("a", (a) => a.innerText)
              : null;
          const date =
            time != null || undefined
              ? await time.$eval("a", (a) => a.innerText)
              : null;
          const tag =
            cat != null || undefined
              ? await cat.$eval("a", (a) => a.innerText)
              : null;
          const catLink =
            cat != null || undefined
              ? await cat.$eval("a", (a) => a.href)
              : null;

          let empty = null;

          //
          let tags = empty;
          let authors = empty;
          let category = this.category;
          let src_logo =
            "https://www.thesouthafrican.com/wp-content/uploads/2018/08/south_african_news_online.png";
          let images = empty;
          let isVid = empty;
          let vidLen = empty;
          const id = generateUniqueId({
            length: 32,
          });
          let src_name = "thesouthafrican";
          let src_url = await page.evaluate(() => location.origin);
          let key = empty;
          let label = empty;
          //
          let subject = empty;
          let format = empty;
          let about = empty;

          arrr.push({
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
          });
        } catch (error) {
          console.log("\x1b[42m%s\x1b[0m", `From ${this.uri} loop: ${error}`);
          continue;
        }
      }
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

const vars = require("./storeVars");
const puppeteer = require("puppeteer");
const generateUniqueId = require("generate-unique-id");
const wsChromeEndpointurl = require("../browser");

let src_name = "Aljazeera";
//
class Scrapper {
  constructor(uri, cat) {
    this.uri = uri;
    this.cat = cat;
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
      await page.waitForSelector(".section-card-list--button");
      await page.waitFor(9000);
      await page.click(".section-card-list--button");
      await page.waitForSelector(".section-card-list--button");
      await page.waitFor(9000);
      await page.click(".section-card-list--button");
      await page.waitForSelector(".section-card-list--button");
      await page.waitFor(9000);
      const items = await page.$$("article");
      await page.waitFor(15000);
      let arrr = [];
      //
      for (const item of items) {
        try {
          await page.evaluate((el) => el.scrollIntoView(), item);
          let src_url = await page.evaluate(() => location.origin);
          await page.waitFor(5000);
          let media = await item.$(".gc__image-wrap");
          const x =
            media !== null
              ? await media.$eval("img", (img) => img.srcset)
              : null;
          let images = "";
          if (x !== null) {
            let y = await x.split(",");
            for (const z of y) {
              let s = ` ${src_url}${z}`;
              console.log(s);
              images += s;
            }
          } else {
            images = null;
          }

          const tbn =
            media !== null || undefined
              ? await media.$eval("img", (img) => img.src)
              : null;
          const headline = await item.$eval(
            "h3 > a > span",
            (h3) => h3.innerText
          );
          let t = await item.$(".article-card__postLabel");
          const tag =
            t !== null
              ? await item.$eval(".article-card__postLabel", (a) => a.innerText)
              : null;
          // const catLink = await item.$eval('a.topics-sec-item-label', a => a.href);
          const date = await item.$eval(
            ".gc__date__date > div",
            (time) => time.innerText
          );
          const lede = await item.$eval(".gc__body-wrap p", (p) => p.innerText);
          const time = await item.$(".icon--play-inverse");
          const vidLen =
            time !== null
              ? await item.$eval(
                  ".gc__footer .gc__meta__content",
                  (div) => div.innerText
                )
              : null;
          let isVid = vidLen !== null ? true : false;
          let url = await item.$eval("h3 > a", (a) => a.href);
          //
          let category = this.cat;
          let empty = null;
          //
          const catLink = this.uri;
          //
          let src_logo =
            "https://www.aljazeera.com/assets/images/AljazeeraLogo.png";

          let author = empty;
          const thumbnail = `${src_url}${tbn}`;
          const id = generateUniqueId({
            length: 32,
          });
          //
          let authors = empty;
          let key = empty;
          let label = empty;
          //
          let subject = empty;
          let format = empty;
          let about = empty;
          let tags = empty;
          let type = "card";
          //
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

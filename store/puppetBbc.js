const helpers = require("./helpers");
const puppeteer = require("puppeteer");
const generateUniqueId = require("generate-unique-id");
const wsChromeEndpointurl = require("../browser");
//
let src_name = "BBC";

class Scrapper {
  constructor(uri) {
    this.uri = uri;
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
      await page.waitFor(15000);
      await page.waitForSelector(".gs-c-promo");
      const items = await page.$$(".gs-c-promo");
      await page.waitFor(5000);
      // let st = "";
      //
    
      //
      for (const item of items) {
        try {
          const body = item;
          const media = await item.$(".gs-c-promo-image");
          const para = await item.$(".gs-c-promo-summary");
          const el = await body.$(".nw-c-promo-meta");
          const cont = await body.$(".qa-time");
          const sect =
            body != null || undefined
              ? await body.$(".gs-c-section-link")
              : null;
          // st = await page.evaluate(el => el.innerHTML, item);
          //
          const mediaLink =
            media != null || undefined
              ? await media.$eval("img", (img) => img.src)
              : null;
          const value =
            mediaLink != null || undefined
              ? await item.$eval("img", (img) => img.dataset.src)
              : null;
          const images =
            mediaLink != null || undefined
              ? await item.$eval("img", (img) => img.srcset)
              : null;
          const url =
            body != null || undefined
              ? await body.$eval("a", (a) => a.href)
              : null;
          const headline =
            body != null || undefined
              ? await body.$eval("h3", (h3) => h3.innerText)
              : null;
          const date =
            el != null || undefined
              ? await body.$eval("time > .gs-u-vh", (span) => span.innerText)
              : null;
          const vidLen =
            cont != null
              ? await body.$eval("span.qa-onscreen", (span) => span.innerText)
              : null;
          const isVid = vidLen != null || undefined ? true : false;
          const cat =
            el != null || undefined
              ? await sect.$eval("span", (span) => span.innerText)
              : null;
          const catLink =
            el != null || undefined
              ? await sect.$eval("span", (span) => span.href)
              : null;
          const lede =
            (para != null || undefined) && (media != null || undefined)
              ? await body.$eval("p", (p) => p.innerText)
              : null;
          //
          let slc = url.slice(21, 31);
          const category = slc == "programmes" ? "programmes" : cat;
          let thumbnail =
            value != null ? value.replace("{width}", "490") : null;
          //
          let type = "card";
          let src_url = await page.evaluate(() => location.origin);
          let empty = null;
          let tags = empty;
          //
          let src_logo =
            "https://nav.files.bbci.co.uk/orbit/db9d3ece642dbb01f23f791064ec1502/img/blq-orbit-blocks_grey_alpha.png";
          let tag = category;
          let author = empty;
          let authors = empty;
          let key = empty;
          let label = empty;
          //
          let subject = empty;
          let format = empty;
          let about = empty;
          const id = generateUniqueId({
            length: 32,
          });
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

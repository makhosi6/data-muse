require('dotenv').config();
const cron = require("node-cron");
const wsChromeEndpointurl = require('../browser');
const puppeteer = require('puppeteer');
const helpers = require('../store/helpers');
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
let src_name = "W24";

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
        await page.goto(uri, { waitUntil: 'networkidle2', timeout: 0 });
        await page.waitForSelector('#load-more-button');
        await page.click('#load-more-button');
        await page.waitFor(63000);
        await page.click('#load-more-button');
        await page.waitFor(63000);
        await page.click('#load-more-button');
        await page.waitFor(63000);
        await page.click('#load-more-button');
        await page.waitFor(63000);
        await page.click('#load-more-button');

        //
        const items = await page.$$('.tf-article');
        await page.waitFor(125000);
        //
        for (const item of items) {
            try {
                //
                const cat = await item.$('.tf-category-name');
                let url_src = uri;
                //
                const url = await item.$eval('a', a => a.href);
                const thumbnail = await item.$eval('img', img => img.src);
                const category = await page.evaluate(a => a.innerText, cat);
                const lede = await item.$eval('p.tf-blurb', p => p.innerText);
                const headline = await item.$eval('span.tf-title', span => span.innerText);
                //
                let empty = null;
                
                //
                let catLink = empty;
                let tag = empty;
                //
                let images = empty;
                //
                let isVid = false;
                let vidLen = empty;
                //
                let author = empty;
                let date = empty;
                // let b = (a != null) ? a[1].replace(/(\r\n|\n|\r)/gm, "").trim() : null;
                await helpers.interfaceAPI({
                    url_src,
                    src_name,
                    url,
                    headline,
                    lede,
                    thumbnail,
                    //
                    src,
                    category,
                    catLink,
                    tag,
                    //
                    images,
                    //
                    isVid,
                    vidLen,
                    //
                    author,
                    date
                })
            } catch (error) {
                console.log('\x1b[42m%s\x1b[0m', `From ${uri} loop: ${error.message}`)
                continue;
            }

        }
        //
        console.log('\x1b[43m%s\x1b[0m', `Done: ${uri}`);
        await page.close();
    } catch (error) {
        console.log('\x1b[41m%s\x1b[0m', `From ${uri} Main: ${error.message}`);
    }
}
let source = "https://www.w24.co.za/";

cron.schedule("0 4 * * SUN", () => {
//         console.log('\x1b[46m%s\x1b[0m', "W24 fired at:" + Date());
//         main(source);
// });
/////
Routa.get('/w24', (req, res) => {
    res.send({
        status: "OFF"
        // "news": add

    });
});
module.exports = Routa;
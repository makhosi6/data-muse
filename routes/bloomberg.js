require('dotenv').config();
const cron = require("node-cron");
const scrollPageToBottom = require('puppeteer-autoscroll-down');
const vars = require('../store/storeVars');
const express = require("express");
const Routa = express.Router();
const wsChromeEndpointurl = require('../browser');
const puppeteer = require('puppeteer');
///
process.setMaxListeners(Infinity);
//
let news = [];

async function main(uri) {
    try {

        const browser = await puppeteer.connect({
            browserWSEndpoint: wsChromeEndpointurl,
            defaultViewport: null
        });
        const page = await browser.newPage();
        page.setUserAgent(vars.userAgent);
        await page.goto(uri, { waitUntil: 'networkidle2', timeout: 0 });
        await page.waitForSelector('.story-package-module__story.mod-story');
        let myVar = setInterval(() => scrollPageToBottom(page), 100);
        await page.waitFor(12300);
        clearInterval(myVar);
        const items = await page.$$('.story-package-module__story.mod-story');
        //
        for (const item of items) {
            try {
                //
                const get = await item.$('.bb-lazy-img__image');
                const f = await item.$('h3 > a');
                const time = await item.$('time');
                const cat = await item.$('.story-package-module__story__eyebrow');
                //
                const url = await page.evaluate(a => a.href, f);
                const categori = (cat != null || undefined) ? await page.evaluate(section => section.textContent, cat) : null;
                const headline = await item.$eval('h3 > a', a => a.innerText);
                const date = (time != null || undefined) ? await page.evaluate(time => time.innerText, time) : null;
                const thumbnail = (get != null || undefined) ? await page.evaluate(img => img.src, get) : null;
                //
                let empty = null;
                let emptyArr = [];

                let lede = empty;
                let author = empty;
                let tag = empty;
                let src = "https://www.conviva.com/wp-content/uploads/2019/12/Bloomberg-logo-.png";
                let src_name = "Bloomberg";
                let vidLen = empty;
                let isVid = false;
                let catLink = empty;
                let url_src = uri;
                let images = emptyArr;
                let category = categori.trim();
                news.push({
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
                console.log('\x1b[42m%s\x1b[0m', `From ${uri} loop: ${error.name}`)
                continue;
            }

        }
        //
        await page.close();
        console.log('\x1b[43m%s\x1b[0m', `Done: ${uri}`);

    } catch (error) {
        console.log('\x1b[41m%s\x1b[0m', `From ${uri} Main: ${error}`);
    }
}
let source = "https://www.bloomberg.com/africa";

// cron.schedule("0 3 * * *", () => {

    console.log('\x1b[46m%s\x1b[0m', "BLOOMBERG fired at:" + Date());
        main(source);
// });

//
Routa.get('/bloomberg', (req, res) => {
    res.send({

        news

    });
});
module.exports = Routa;
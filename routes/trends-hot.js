require('dotenv').config();
const cron = require("node-cron");
const vars = require('../store/storeVars');
// const wsChromeEndpointurl = require('../browser');
const puppeteer = require('puppeteer');
const generateUniqueId = require('generate-unique-id');
const express = require("express");
const Routa = express.Router();
///

//
let trends = [];

async function main(uri) {
    try {

           const browser = await puppeteer.launch({
      
         defaultViewport: null,
            headless: false
    });
        const page = await browser.newPage();
        page.setUserAgent(vars.userAgent);
        await page.goto(uri, { waitUntil: 'networkidle2', timeout: 0 });
        await page.waitForSelector('[ng-repeat="trendingData in ctrl.dailyTrendingSearches"] .details');
        await page.waitFor(3000);
        const block = await page.$('[ng-repeat="trendingData in ctrl.dailyTrendingSearches"]');
        const items = await block.$$('.details');
        //
        for (const item of items) {
            try {
                //
                const hed = await item.$('[ng-repeat="titlePart in titleArray"]');
                const link = await item.$('[bind-html-compile="subtitles.articleTitle"]');
                //
                const url = await page.evaluate(a => a.href, link);
                const headline = await page.evaluate(a => a.innerText, hed);
                const id = generateUniqueId({
                    length: 32
                });
                //
                    let empty = null;
                    let lede = empty;
                    let thumbnail = empty;
                    let category = empty;
                    let catLink = empty;
                    let images = empty;
                    let src_name = empty;
                    let src_url = empty;
                    let src_logo = empty;
                    //
                    let isVid = empty;
                    let vidLen = empty;
                    //
                    let subject = empty;
                    let format = empty;
                    let about = empty;
                    
                    //
                    let type = "trend";
                    let tag = empty;
                    let tags = empty;
                    //
                    let author = empty;
                    let authors = empty;
                    let date = empty;

                trends.push({
                    id,
                    url,
                    headline,
                    lede,
                    thumbnail,
                    category,
                    catLink,
                    images,
                    //
                    "key": Math.floor(Math.random() * 13400000),
                    "label": headline,
                    //
                    src_name,
                    src_url,
                    src_logo,
                    //
                    isVid,
                    vidLen ,
                    //
                    subject,
                    format,
                    about,
                    
                    //
                    type,
                    tag,
                    tags,
                    //
                    author,
                    authors ,
                    date
                    //
                 
                })
            } catch (error) {
                console.log('\x1b[42m%s\x1b[0m', `From ${uri} loop: ${error}`)
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
let source = "https://trends.google.com/trends/trendingsearches/daily?geo=ZA";

// cron.schedule("0 */6 * * *", () => {
        console.log('\x1b[46m%s\x1b[0m', " HOT TRENDS fired at:" + Date());
        main(source);
// });


Routa.get('/hot-trends', (req, res) => {
    res.send({
        trends

    });
});
module.exports = Routa;
require('dotenv').config();
const cron = require("node-cron");
const vars = require('../store/storeVars');
const wsChromeEndpointurl = require('../browser');
const puppeteer = require('puppeteer');
const express = require("express");
const Routa = express.Router();
///
process.setMaxListeners(Infinity);
//
let trendsHot = [];

async function main(uri) {
    try {

        const browser = await puppeteer.connect({
            browserWSEndpoint: wsChromeEndpointurl,
            defaultViewport: null
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
                //

                trendsHot.push({
                    "url": url,
                    "key": Math.floor(Math.random() * 13400000),
                    "label": headline,
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
let source = "https://trends.google.com/trends/trendingsearches/daily?geo=ZA";

cron.schedule("0 */6 * * *", () => {

    (() => {
        console.log('\x1b[46m%s\x1b[0m', " HOT TRENDS fired at:" + Date());
        main(source);
    })();
});


Routa.get('/hot-trends', (req, res) => {
    res.send({
        trendsHot

    });
});
module.exports = Routa;
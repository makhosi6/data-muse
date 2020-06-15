const express = require('express');
const newsTrends = express.Router();
require('dotenv').config()
const vars = require('./store/storeVars');
const wsChromeEndpointurl = require('../browser');
const puppeteer = require('puppeteer');
///
process.setMaxListeners(Infinity);
//
let trends = [];

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

                trends.push({
                    "url": url,
                    "headline": headline,
                })
            } catch (error) {
                console.trace('\x1b[42m%s\x1b[0m', `From ${uri} loop: ${error}`);
                continue;
            }

        }
        //
        await page.close();
        console.log('\x1b[43m%s\x1b[0m', `Done: ${uri}`);

    } catch (error) {
        console.trace('\x1b[41m%s\x1b[0m', `From ${uri} Main: ${error}`);
    }
}
let source = "https://trends.google.com/trends/trendingsearches/daily?geo=ZA";
main(source);
/////
newsTrends.get('/trends', (req, res) => {
    res.send({
        trends
    });
})

module.exports = newsTrends;
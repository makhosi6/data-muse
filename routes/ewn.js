const cron = require("node-cron");
const wsChromeEndpointurl = require('../browser');
const puppeteer = require('puppeteer');
require('dotenv').config();
const express = require("express");
const Routa = express.Router();
const puppet = require('../store/puppetEwn');
const vars = require('../store/storeVars');
//
process.setMaxListeners(Infinity);
///
let add_trending = [];
let src_name = "EWN";
//
async function main(uri_trending) {
    try {
        let url_src = uri_trending;
        const browser = await puppeteer.connect({
            browserWSEndpoint: wsChromeEndpointurl,
            defaultViewport: null
        });
        const page_trending = await browser.newPage();
        page_trending.setUserAgent(vars.userAgent);
        await page_trending.goto(uri_trending, { waitUntil: 'networkidle2', timeout: 0 });
        await page_trending.waitForSelector(".most-popular.track-mostpopular");
        const wrapper = await page_trending.$(".most-popular.track-mostpopular");
        const items_trending = await wrapper.$$('li');
        await page_trending.waitFor(5000);
        //
        for (const item of items_trending) {
            try {
                const url = await item.$eval('a', a => a.href);
                const headline = await item.$eval('a', a => a.innerText);

                add_trending.push({
                    url_src,
                    src_name,
                    url,
                    headline
                })

            } catch (error) {
                console.log('\x1b[42m%s\x1b[0m', `From ${uri_trending} loop: ${error.name}`)
                continue;
            }
        }
        console.log('\x1b[43m%s\x1b[0m', `Done: ${uri_trending}`);
        await page_trending.close();
    } catch (error) {
        console.log('\x1b[41m%s\x1b[0m', `From ${uri_trending} Main: ${error}`);
    }
}

let sources = {
    business: "https://ewn.co.za/categories/business",
    lifestyle: "https://ewn.co.za/categories/lifestyle",
    politics: "https://ewn.co.za/categories/politics",
    sport: "https://ewn.co.za/categories/sport",
    trending: "https://ewn.co.za/",
    spt2: "https://ewn.co.za/categories/sport?pagenumber=2&perPage=30"
}


const Puppet = puppet.Scrapper;
const dataOne = new Puppet(sources.business);
const dataTwo = new Puppet(sources.lifestyle);
const dataThree = new Puppet(sources.politics);
const dataFour = new Puppet(sources.sport);


// cron.schedule("0 */6 * * *", () => {

        console.log("ENEWS fired at:" + Date());
        //One
        dataOne.puppet();
        //Two
        dataTwo.puppet();
        //three
        dataThree.puppet();
        //four
        dataFour.puppet();

        main(sources.trending);
// });
//
Routa.get('/ewn', (req, res) => {
    res.send({

        "news": dataOne.data,
        "lifestyle": dataTwo.data,
        "politics": dataThree.data,
        "sport": dataFour.data,
        "trending": add_trending

    });
});
module.exports = Routa;
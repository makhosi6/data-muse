const express = require('express');
const ewnRouta = express.Router();
require('dotenv').config()
const wsChromeEndpointurl = require('../browser');
const puppeteer = require('puppeteer');
const puppet = require('./store/puppetEwn');
const vars = require('./store/storeVars')
    //
process.setMaxListeners(Infinity);
///
let add_trending = [];
//
async function main( /*uri_business, uri_lifestyle, uri_politics, uri_sport,uri_spt2*/ uri_trending) {
    try {
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
                    "url": url,
                    "headline": headline
                })

            } catch (error) {
                console.trace('\x1b[42m%s\x1b[0m', `From ${uri_trending} loop: ${error}`);
                continue;
            }
        }
        console.log('\x1b[43m%s\x1b[0m', `Done: ${uri_trending}`);
        await page_trending.close();
    } catch (error) {
        console.trace('\x1b[41m%s\x1b[0m', `From ${uri_trending} Main: ${error}`);
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
//One
const dataOne = new Puppet(sources.business);
dataOne.puppet();
//Two
const dataTwo = new Puppet(sources.lifestyle);
dataTwo.puppet();
//three
const dataThree = new Puppet(sources.politics);
dataThree.puppet();
//four
const dataFour = new Puppet(sources.sport);
dataFour.puppet();

//source_business, source_lifestyle, source_politics, source_sport,

main(sources.trending);
/////////////
ewnRouta.get('/ewn', (req, res) => {
    res.send({
        "ewnNews": dataOne.data,
        "ewnLifestyle": dataTwo.data,
        "ewnPolitics": dataThree.data,
        "ewnSport": dataFour.data,
        "ewnTrending": add_trending
    });
})

module.exports = ewnRouta;
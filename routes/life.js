const express = require('express');
const w24 = express.Router();
require('dotenv').config()
const wsChromeEndpointurl = require('../browser');
const puppeteer = require('puppeteer');
const vars = require('./store/storeVars')
    ///
process.setMaxListeners(Infinity);
//
let add = [];

async function main(uri) {
    try {
        const browser = await puppeteer.connect({
            browserWSEndpoint: wsChromeEndpointurl,
            defaultViewport: null
        });
        const page = await browser.newPage();
        page.setUserAgent(vars.userAgent);
        await page.goto(uri, { waitUntil: 'networkidle2', timeout: 0 });
        await page.waitForSelector('#load-more-button');
        await page.click('#load-more-button');
        await page.waitFor(33000);
        await page.click('#load-more-button');
        await page.waitFor(33000);
        await page.click('#load-more-button');
        await page.waitFor(33000);
        await page.click('#load-more-button');
        await page.waitFor(33000);
        await page.click('#load-more-button');

        //
        const items = await page.$$('.tf-article');
        await page.waitFor(125000);
        //
        for (const item of items) {
            try {
                //
                const cat = await item.$('.tf-category-name');

                //
                const url = await item.$eval('a', a => a.href);
                const thumbnail = await item.$eval('img', img => img.src);
                const category = await page.evaluate(a => a.innerText, cat);
                const lede = await item.$eval('p.tf-blurb', p => p.innerText);
                const headline = await item.$eval('span.tf-title', span => span.innerText);
                //
                let empty = null;
                let emptyArr = "";
                //
                let catLink = empty;
                let tag = empty;
                //
                let images = emptyArr;
                //
                let isVid = false;
                let vidLen = empty;
                //
                let author = empty;
                let date = empty;
                // let b = (a != null) ? a[1].replace(/(\r\n|\n|\r)/gm, "").trim() : null;
                add.push({
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
                console.trace('\x1b[42m%s\x1b[0m', `From ${uri} loop: ${error}`);
                continue;
            }

        }
        //

        console.log('\x1b[43m%s\x1b[0m', `Done: ${uri}`);
        await page.close();
    } catch (error) {
        console.trace('\x1b[41m%s\x1b[0m', `From ${uri} Main: ${error}`);
    }
}
let source = "https://www.w24.co.za/";
main(source);
/////
w24.get('/w24', (req, res) => {
    res.send({
        "source": {
            "name": "w24",
            "page url": source
        },
        "w24": add
    });
})

module.exports = w24;
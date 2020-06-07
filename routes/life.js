const express = require('express');
const w24 = express.Router();
require('dotenv').config()
const puppeteer = require('puppeteer');
const vars = require('./store/storeVars')
    ///
process.setMaxListeners(Infinity);
//
let add = [];

async function main(uri) {
    try {
        const browser = await puppeteer.launch({
            args: vars.argsArr,
            defaultViewport: null,
            headless: vars.bool,
            executablePath: vars.exPath
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
                const link = await item.$eval('a', a => a.href);
                const thumbnail = await item.$eval('img', img => img.src);
                const category = await page.evaluate(a => a.innerText, cat);
                const lede = await item.$eval('p.tf-blurb', p => p.innerText);
                const headline = await item.$eval('span.tf-title', span => span.innerText);
                //

                // let a = (time != null || undefined) ? time.split("\n") : null;
                // let b = (a != null) ? a[1].replace(/(\r\n|\n|\r)/gm, "").trim() : null;
                add.push({
                    "lede": lede,
                    "url": link,
                    "thumbnail": thumbnail,
                    "headline": headline,
                    "category": category
                })
            } catch (error) {
                console.trace('\x1b[42m%s\x1b[0m', `From ${uri} loop: ${error}`);
                continue;
            }

        }
        //

        console.log('\x1b[43m%s\x1b[0m', `Done: ${uri}`);
        browser.close();
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
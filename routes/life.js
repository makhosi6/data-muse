const express = require('express');
const w24 = express.Router();
require('dotenv').config()
const puppeteer = require('puppeteer');
const IS_PRODUCTION = process.env.NODE_ENV === 'production';
const BROWSER = process.env.BROWSER;
///
process.setMaxListeners(Infinity);
//
let add = [];

async function main(uri) {

    try {


        const browser = (IS_PRODUCTION) ?
            await puppeteer.connect({
                browserWSEndpoint: `wss://chrome.browserless.io/?token=${BROWSER}`
            }) :
            await puppeteer.launch({
                args: [
                    "--ignore-certificate-errors",
                    "--no-sandbox",
                    '--disable-dev-shm-usage',
                    "--disable-setuid-sandbox",
                    "--window-size=1920,1080",
                    "--disable-accelerated-2d-canvas",
                    "--disable-gpu"
                ],
                defaultViewport: null,
                executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe'

            });

        const page = await browser.newPage();
        page.setUserAgent('Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML; like Gecko) snap Chromium/80.0.3987.122 Chrome/80.0.3987.122 Safari/537.36');

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
                console.log(`From ${uri} loop: ${error}`.bgMagenta);
                continue;

            }
        }
        console.log(`Done: ${uri}`.bgYellow);

        browser.close();
    } catch (error) {
        console.log(`From ${uri} Main: ${error}`.bgRed);
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
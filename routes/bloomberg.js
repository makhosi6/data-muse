const express = require('express');
const blomNews = express.Router();
const puppeteer = require('puppeteer');
require('dotenv').config()
const BROWSER = process.env.BROWSER;
const scrollPageToBottom = require('puppeteer-autoscroll-down');
const IS_PRODUCTION = process.env.NODE_ENV === 'production';
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

        await page.waitForSelector('.story-package-module__story.mod-story');

        let myVar = setInterval(() => scrollPageToBottom(page), 100);
        //
        await page.waitFor(12300);
        //
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
                const link = await page.evaluate(a => a.href, f);
                const category = (cat != null || undefined) ? await page.evaluate(section => section.textContent, cat).trim() : null;
                const headline = await item.$eval('h3 > a', a => a.innerText);
                const date = (time != null || undefined) ? await page.evaluate(time => time.innerText, time) : null;
                const thumbnail = (get != null || undefined) ? await page.evaluate(img => img.src, get) : null;
                //

                add.push({

                    "date": date,
                    "category": category,
                    "url": link,
                    "thumbnail": thumbnail,
                    "headline": headline,
                })
            } catch (error) {
                console.log(`From ${uri} loop: ${error}`.bgMagenta);
                continue;
            }
        }
        console.log(`Done: ${uri}`.bgYellow);
        clearInterval(myVar);
        browser.close();

    } catch (error) {
        console.log(`From ${uri} Main: ${error}`.bgRed);
    }
}
let source = "https://www.bloomberg.com/africa"
main(source);
/////
blomNews.get('/bloomberg', (req, res) => {
    res.send({
        "source": {
            "name": "blomNews",
            "page url": source
        },
        "blomNews": add
    });
})

module.exports = blomNews;
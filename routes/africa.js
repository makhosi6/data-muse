const express = require('express');
const africa = express.Router();
require('dotenv').config()
const BROWSER = process.env.BROWSER;
const puppeteer = require('puppeteer');
const IS_PRODUCTION = process.env.NODE_ENV === 'production';
var colors = require('colors');
///
process.setMaxListeners(Infinity);
//
let add = [];
let data = [];
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
        await page.goto(uri, { waitUntil: 'networkidle2', timeout: 0 });
        await page.waitFor(125000);
        await page.waitForSelector('article');

        const emAll = await page.$$('article.just-in__article');

        for (const each of emAll) {
            try {

                const time = await each.$('time');
                const ab = await each.$('a');
                const date = (time != null || undefined) ? await page.evaluate(i => i.textContent, time) : null;
                //
                const headline = await each.$eval('h3 > a', a => a.innerText);
                //
                const link = await page.evaluate(a => a.href, ab);
                data.push({
                    "date": date.replace(/(\r\n|\n|\r)/gm, "").trim(),
                    "url": link,
                    "headline": headline.replace(/(\r\n|\n|\r)/gm, "").trim(),
                })
            } catch (error) {
                console.log(`From ${uri} loop: ${error}`.bgMagenta);

            }
        }

        //
        const items = await page.$$('article');
        //

        for (const item of items) {
            try {

                //
                const timeStamp = await item.$('.boxPlay--duration');
                const e = await item.$('img');
                const f = await item.$('.teaser__title');
                const time = await item.$('time');
                //
                const link = await page.evaluate(a => a.href, item);
                const headline = await item.$eval('.teaser__title', a => a.textContent);
                const date = (time != null || undefined) ? await page.evaluate(i => i.textContent, time).trim() : null;
                const thumbnail = (e != null || undefined) ? await item.$eval('img', img => img.src) : null;
                const vidLen = (timeStamp != null || undefined) ? await page.evaluate(a => a.innerText, timeStamp) : null;
                const isVid = (timeStamp != null || undefined) ? true : false;
                //

                const iHtml = await page.evaluate(el => el.innerHTML, item);

                add.push({
                    "isVid": isVid,
                    "vidLen": vidLen,
                    "date": date,
                    "thumbnail": thumbnail,
                    "url": link,
                    "headline": headline.trim()
                })
            } catch (error) {
                console.log(`From ${uri} loop: ${error}`.bgMagenta);
                continue;

            }
        }
        console.log(`Done: ${uri}`.bgYellow)

        browser.close();
    } catch (error) {
        console.log(`From ${uri} Main: ${error}`.bgRed);
    }
}
let source = "https://www.africanews.com/";
main(source);
/////
africa.get('/africa', (req, res) => {
    res.send({
        "source": {
            "name": "africa",
            "page url": source
        },
        "africa": add,

        "trending": data
    });
})

module.exports = africa;
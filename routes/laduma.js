const express = require('express');
const international = express.Router();
require('dotenv').config()
const BROWSER = process.env.BROWSER;
const puppeteer = require('puppeteer');
const IS_PRODUCTION = process.env.NODE_ENV === 'production';

///
process.setMaxListeners(Infinity);
//
let add_inter = [];
let add_local = [];

async function main(uri_inter, uri_local) {

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

        const page_inter = await browser.newPage();
        page_inter.setUserAgent('Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML; like Gecko) snap Chromium/80.0.3987.122 Chrome/80.0.3987.122 Safari/537.36');

        await page_inter.goto(uri_inter, { waitUntil: 'networkidle2', timeout: 0 });

        await page_inter.waitForSelector('.pod');
        //
        const items_inter = await page_inter.$$('.pod');
        await page_inter.waitFor(125000);
        //
        for (const item of items_inter) {
            try {
                // const left = await item.$('.right > .content > .article-synopsis.d-none.d-md-block');
                const get = await item.$('img.story-img');
                const f = await item.$('.pod__meta');

                //
                const thumbnail = await page_inter.evaluate(img => img.dataset.src, get);
                const link = await item.$eval('a', a => a.href);
                const headline = await item.$eval('h2 > a', a => a.innerText);
                const time = await page_inter.evaluate(a => a.innerText, f);
                const iHtml = await page_inter.evaluate(el => el.innerHTML, item);

                let a = (time != null || undefined) ? time.split("\n") : null;
                let b = (a != null) ? a[1].replace(/(\r\n|\n|\r)/gm, "").trim() : null;
                add_inter.push({
                    "time": b,
                    "url": link,
                    "thumbnail": thumbnail,
                    "headline": headline,
                })
            } catch (error) {
                console.log(`From ${uri_inter} loop: ${error}`.bgMagenta);
                continue;

            }
        }
        //


        const page_local = await browser.newPage();
        page_local.setUserAgent('Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML; like Gecko) snap Chromium/80.0.3987.122 Chrome/80.0.3987.122 Safari/537.36');

        await page_local.goto(uri_local, { waitUntil: 'networkidle2', timeout: 0 });

        await page_local.waitForSelector('.pod');
        //
        const items_local = await page_local.$$('.pod');
        await page_local.waitFor(125000);
        //
        for (const item of items_local) {
            try {
                // const left = await item.$('.right > .content > .article-synopsis.d-none.d-md-block');
                const get = await item.$('img.story-img');
                const f = await item.$('.pod__meta');

                //
                const thumbnail = await page_local.evaluate(img => img.dataset.src, get);
                const link = await item.$eval('a', a => a.href);
                const headline = await item.$eval('h2 > a', a => a.innerText);
                const time = await page_local.evaluate(a => a.innerText, f);
                const iHtml = await page_local.evaluate(el => el.innerHTML, item);

                let a = (time != null || undefined) ? time.split("\n") : null;
                let b = (a != null) ? a[1].replace(/(\r\n|\n|\r)/gm, "").trim() : null;
                add_local.push({
                    "time": b,
                    "url": link,
                    "thumbnail": thumbnail,
                    "headline": headline,
                })
            } catch (error) {
                console.log(`From ${uri_local} loop: ${error}`.bgMagenta);
                continue;

            }
        }

        //
        console.log(`Done: ${uri_inter}`.bgYellow);

        browser.close();
    } catch (error) {
        console.log(`From ${uri_inter} Main: ${error}`.bgRed);
    }
}
let source_inter = "https://www.soccerladuma.co.za/news/articles/international/landing";
let source_local = "https://www.soccerladuma.co.za/news/articles/local/landing";
main(source_inter, source_local);
/////
international.get('/laduma', (req, res) => {
    res.send({

        "international": add_inter,
        "local": add_local
    });
})

module.exports = international;
const express = require('express');
const mgNews = express.Router();
const puppeteer = require('puppeteer');
require('dotenv').config()
const BROWSER = process.env.BROWSER;
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

        await page.waitForSelector('.td_module_flex');
        //
        const items = await page.$$('.td_module_flex');
        await page.waitFor(125000);
        //
        for (const item of items) {
            try {
                // const left = await item.$('.right > .content > .article-synopsis.d-none.d-md-block');
                const get = await item.$('.td-image-wrap');
                const e = await item.$('.td-image-wrap > span');
                const f = await item.$('h3 > a');
                const time = await item.$('time');
                const cred = await item.$('.td-post-author-name > a');
                const para = await item.$('.td-excerpt');
                const cat = await item.$('.td-post-category');
                //
                const thumbnail = await page.evaluate(a => a.style.backgroundImage, e);
                const author = (cred != null || undefined) ? await page.evaluate(a => a.innerText, cred) : null;
                const date = (time != null || undefined) ? await page.evaluate(time => time.innerText, time) : null;
                const link = await page.evaluate(a => a.href, get);
                const headline = await item.$eval('h3 > a', span => span.innerText);
                const lede = (para != null || undefined) ? await item.$eval('.td-excerpt', div => div.innerText) : null;
                const category = (cat != null || undefined) ? await item.$eval('.td-post-category', a => a.innerText) : null;
                //
                let a = thumbnail.split('url("');
                let b = a[1];
                let c = b.split('")');
                let d = c[0];

                const iHtml = await page.evaluate(el => el.innerHTML, item);

                add.push({
                    "author": author,
                    "date": date,
                    "lede": lede,
                    "category": category,
                    "url": link,
                    "thumbnail": d,
                    "headline": headline,
                })
            } catch (error) {
                console.log(`From ${uri} loop: ${error}`.bgMagenta);
                continue;
            }
        }
        console.log(`Done: ${uri}`.bgYellow);

        browser.close();
    } catch (error) {
        console.log(`From ${uri} loop: ${error}`.bgRed);
    }
}
let source = "https://mg.co.za/";
main(source)
    /////
mgNews.get('/mg/news', (req, res) => {
    res.send({
        "source": {
            "name": "mgNews",
            "page url": source
        },
        "mgNews": add
    });
})

module.exports = mgNews;
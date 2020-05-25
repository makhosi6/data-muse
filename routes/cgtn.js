const express = require('express');
const cgtnNews = express.Router();
const puppeteer = require('puppeteer');
require('dotenv').config()
const BROWSER = process.env.BROWSER;
const IS_PRODUCTION = process.env.NODE_ENV === 'production';
///
process.setMaxListeners(Infinity);
//
let add_cgtn = [];

async function main(uri_cgtn) {
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
        const page_cgtn = await browser.newPage();
        page_cgtn.setUserAgent('Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML; like Gecko) snap Chromium/80.0.3987.122 Chrome/80.0.3987.122 Safari/537.36');
        await page_cgtn.goto(uri_cgtn, { waitUntil: 'networkidle2', timeout: 0 });
        await page_cgtn.waitForSelector('.cg-newsWrapper');
        await page_cgtn.waitFor(12300);
        const items_cgtn = await page_cgtn.$$('.cg-newsWrapper');
        for (const item of items_cgtn) {
            try {
                //
                const image = await item.$('.cg-pic > a > img');
                const hed = await item.$('h4 > a');
                const time = await item.$('.cg-time');
                const cat = await item.$('.cg-newsCategory');
                const para = await item.$('.cg-content');
                //
                const link = await page_cgtn.evaluate(a => a.href, hed);
                const category = (cat != null || undefined) ? await page_cgtn.evaluate(section => section.textContent, cat) : null;
                const headline = await item.$eval('h4 > a', a => a.innerText);
                const date = (time != null || undefined) ? await page_cgtn.evaluate(time => time.innerText, time) : null;
                const lede = (para != null || undefined) ? await page_cgtn.evaluate(div => div.innerText, para) : null;
                const thumbnail = (image != null || undefined) ? await page_cgtn.evaluate(img => img.src, image) : null;
                //
                let a = (date != null) ? date.trim() : date;
                let b = (category != null) ? category.trim() : category;
                let c = (headline != null) ? headline.trim() : headline;
                //
                add_cgtn.push({
                    "lede": lede,
                    "date": a,
                    "category": b,
                    "url": link,
                    "thumbnail": thumbnail,
                    "headline": c,
                })
            } catch (error) {
                console.log(`From ${uri_cgtn} loop: ${error}`.bgMagenta);
                continue;
            }
        }
        console.log(`Done: ${uri_cgtn}`.bgYellow);
        browser.close();

    } catch (error) {
        console.log(`From ${uri_cgtn} Main: ${error}`.bgRed);
    }
}
let source_cgtn = "https://www.cgtn.com/";
main(source_cgtn);
/////
cgtnNews.get('/cgtn', (req, res) => {
    res.send({

        "cgtnNews": add_cgtn
    });
})

module.exports = cgtnNews;
const express = require('express');
const citizen = express.Router();
require('dotenv').config()
const BROWSER = process.env.BROWSER;
const puppeteer = require('puppeteer');
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


        await page.waitFor(125000);
        await page.waitForSelector('.article');

        const emAll = await page.$$('.lead-story');

        for (const each of emAll) {
            try {
                // const left = await item.$('.right > .content > .article-synopsis.d-none.d-md-block');
                const get = await each.$('.image img');
                const a = await each.$('.image > a');
                //
                const thumbnail = await page.evaluate(a => a.src, get);
                const link = await page.evaluate(a => a.href, a);
                const headline = await each.$eval('h3 > a', span => span.innerText);
                const category = await each.$eval('span.category-link > a', a => a.innerText);
                const lede = await each.$eval('.excerpt', span => span.innerText);
                // const ledeT = await each.$eval('span.js-shave', span => span.innerText);
                // let para = lede + ledeT;
                //

                add.push({
                    "category": category,
                    "thumbnail": thumbnail,
                    "url": link,
                    "headline": headline,
                    "lede": lede
                })
            } catch (error) {
                console.log(`From ${uri} loop: ${error}`.bgMagenta);

            }
        }

        //
        const items = await page.$$('div.article');
        //

        for (const item of items) {
            try {

                //
                const f = await item.$('a');
                const image = await item.$('.img-responsive');
                const cat = await item.$('.category-link > a');
                //
                const category = await page.evaluate(div => div.innerText, cat);
                const thumbnail = await page.evaluate(img => img.src, image);
                const link = await page.evaluate(a => a.href, cat);
                const headline = await item.$eval('.homelead2-headline-more-stories', a => a.innerText);
                //

                const iHtml = await page.evaluate(el => el.innerHTML, item);

                add.push({
                    "category": category,
                    "thumbnail": thumbnail,
                    "url": link,
                    "headline": headline
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
let source = "https://citizen.co.za/"
main(source);
/////
citizen.get('/citizen', (req, res) => {
    res.send({
        "source": {
            "name": "citizen",
            "page url": source
        },
        "citizen": add
    });
})

module.exports = citizen
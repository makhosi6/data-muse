const express = require('express');
const espnEnews = express.Router();
const BROWSER = process.env.BROWSER;
const puppeteer = require('puppeteer');
const IS_PRODUCTION = process.env.NODE_ENV === 'production';
//
process.setMaxListeners(Infinity);
///
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
        await page.waitForSelector('.item-list');
        const items = await page.$$('.post__section-item-display');

        //
        for (let i = 0; i < items.length; i++) {
            try {
                await page.goto(uri, { waitUntil: 'networkidle2', timeout: 0 });
                await page.waitForSelector('.item-list');
                const items = await page.$$('.post__section-item-display');


                const item = items[i];
                const title = await item.$('.post__title');
                const link = await title.$eval('a', a => a.href);
                const para = await item.$('.post__excerpt');
                const mediaLink = await item.$eval('img', img => img.src);
                const headlineText = await title.$eval('a.internal-link', a => a.innerText);
                const tagEl = await item.$('a.topic-tag');
                const tag = (tagEl != null || undefined) ? await item.$eval('a.topic-tag', a => a.innerText) : null;
                const cred = await item.$('.post-attribution__source');
                const source = (cred != null || undefined) ? await cred.$eval('a', a => a.innerText) : null;
                const lede = await para.$eval('a', a => a.innerText);
                const timeStamp = await item.$eval('time', time => time.innerText);
                //
                const publisher = source.replace(" and ", " & ");
                ////
                const windo = await item.$('.post__title > a');

                windo.click();

                await page.waitFor(33000);
                await page.waitForSelector('.post__read-more');
                let button = await page.$x('//*[@id="content"]/div/main/div/div/div[1]/div/div[2]');

                let ellen = await page.waitForSelector('.post__read-more');
                const url = (button != null || undefined) ? await ellen.$eval('a', a => a.href) : null;

                const a = url.split("url=");
                const b = a[1];
                const c = b.split("&v=");
                const d = c[0];
                const e = decodeURIComponent(d);


                add.push({

                    "url": e,
                    "media_link": mediaLink,
                    "headline": headlineText,
                    "tag": tag,
                    "source": publisher,
                    "lede": lede,
                    "time_stamp": timeStamp
                });

            } catch (error) {
                console.log(`From ${uri} loop: ${error}`.bgMagenta);
            }
        }
        console.log(`Done: ${uri}`.bgYellow);
        browser.close();
    } catch (error) {
        console.log(`From ${uri} Main: ${error}`.bgRed);
    }

}

let source = "https://flipboard.com/@espn";
main(source);
/////////////
espnEnews.get('/enews', (req, res) => {
    res.send({
        "source": {
            "name": "espnEnews",
            "page url": source
        },
        "espnEnews": add
    });
})

module.exports = espnEnews;
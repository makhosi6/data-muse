const express = require('express');
const espn = express.Router();
const BROWSER = process.env.BROWSER;
const puppeteer = require('puppeteer');
const IS_PRODUCTION = process.env.NODE_ENV === 'production';
var colors = require('colors');
//
process.setMaxListeners(Infinity);
///
let add_news = [];
let add_nba = [];
let add_olympics = [];
let add_soccer = [];

async function main(uri_news, uri_nba, uri_olympics, uri_soccer) {
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

        const page_news = await browser.newPage();
        page_news.setUserAgent('Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML; like Gecko) snap Chromium/80.0.3987.122 Chrome/80.0.3987.122 Safari/537.36');

        await page_news.goto(uri_news, { waitUntil: 'networkidle2', timeout: 0 });
        await page_news.waitForSelector('.item-list');
        const items_news = await page_news.$$('.post__section-item-display');

        //
        for (let i = 0; i < items_news.length; i++) {
            try {
                await page_news.goto(uri_news, { waitUntil: 'networkidle2', timeout: 0 });
                await page_news.waitForSelector('.item-list');
                const items_news = await page_news.$$('.post__section-item-display');
                const item = items_news[i];
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

                await page_news.waitFor(33000);
                await page_news.waitForSelector('.post__read-more');
                let button = await page_news.$x('//*[@id="content"]/div/main/div/div/div[1]/div/div[2]');

                let ellen = await page_news.waitForSelector('.post__read-more');
                const url = (button != null || undefined) ? await ellen.$eval('a', a => a.href) : null;

                const a = url.split("url=");
                const b = a[1];
                const c = b.split("&v=");
                const d = c[0];
                const e = decodeURIComponent(d);


                add_news.push({

                    "url": e,
                    "media_link": mediaLink,
                    "headline": headlineText,
                    "tag": tag,
                    "source": publisher,
                    "lede": lede,
                    "time_stamp": timeStamp
                });
            } catch (error) {
                console.log(`From ${uri_news} loop: ${error}`.bgMagenta);
            }

        }

        //
        const page_nba = await browser.newPage();
        page_nba.setUserAgent('Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML; like Gecko) snap Chromium/80.0.3987.122 Chrome/80.0.3987.122 Safari/537.36');
        await page_nba.goto(uri_nba, { waitUntil: 'networkidle2', timeout: 0 });
        await page_nba.waitForSelector('.item-list');
        const items_nba = await page_nba.$$('.post__section-item-display');

        //
        for (let i = 0; i < items_nba.length; i++) {
            try {
                await page_nba.goto(uri_nba, { waitUntil: 'networkidle2', timeout: 0 });
                await page_nba.waitForSelector('.item-list');
                const items = await page_nba.$$('.post__section-item-display');
                const item = items_nba[i];
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

                await page_nba.waitFor(33000);
                await page_nba.waitForSelector('.post__read-more');
                let button = await page_nba.$x('//*[@id="content"]/div/main/div/div/div[1]/div/div[2]');

                let ellen = await page_nba.waitForSelector('.post__read-more');
                const url = (button != null || undefined) ? await ellen.$eval('a', a => a.href) : null;

                const a = url.split("url=");
                const b = a[1];
                const c = b.split("&v=");
                const d = c[0];
                const e = decodeURIComponent(d);


                add_nba.push({

                    "url": e,
                    "media_link": mediaLink,
                    "headline": headlineText,
                    "tag": tag,
                    "source": publisher,
                    "lede": lede,
                    "time_stamp": timeStamp
                });

            } catch (error) {
                console.log(`From ${uri_nba} loop: ${error}`.bgMagenta);
            }
        }

        //
        const page_olympics = await browser.newPage();
        page_olympics.setUserAgent('Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML; like Gecko) snap Chromium/80.0.3987.122 Chrome/80.0.3987.122 Safari/537.36');

        await page_olympics.goto(uri_olympics, { waitUntil: 'networkidle2', timeout: 0 });
        await page_olympics.waitForSelector('.item-list');
        const items = await page_olympics.$$('.post__section-item-display');

        //
        for (let i = 0; i < items_olympics.length; i++) {
            try {
                await page_olympics.goto(uri_olympics, { waitUntil: 'networkidle2', timeout: 0 });
                await page_olympics.waitForSelector('.item-list');
                const items_olympics = await page_olympics.$$('.post__section-item-display');
                //
                const item_olympics = items_olympics[i];
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

                await page_olympics.waitFor(33000);
                await page_olympics.waitForSelector('.post__read-more');
                let button = await page_olympics.$x('//*[@id="content"]/div/main/div/div/div[1]/div/div[2]');

                let ellen = await page_olympics.waitForSelector('.post__read-more');
                const url = (button != null || undefined) ? await ellen.$eval('a', a => a.href) : null;

                const a = url.split("url=");
                const b = a[1];
                const c = b.split("&v=");
                const d = c[0];
                const e = decodeURIComponent(d);

                add_olympics.push({
                    "url": e,
                    "media_link": mediaLink,
                    "headline": headlineText,
                    "tag": tag,
                    "source": publisher,
                    "lede": lede,
                    "time_stamp": timeStamp
                });
            } catch (error) {
                console.log(`From ${uri_olympics} loop: ${error}`.bgMagenta);
            }
        }

        //
        const page_soccer = await browser.newPage();
        page_soccer.setUserAgent('Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML; like Gecko) snap Chromium/80.0.3987.122 Chrome/80.0.3987.122 Safari/537.36');

        await page_soccer.goto(uri_soccer, { waitUntil: 'networkidle2', timeout: 0 });
        await page_soccer.waitForSelector('.item-list');
        const items_soccer = await page_soccer.$$('.post__section-item-display');

        //
        for (let i = 0; i < items_soccer.length; i++) {
            try {
                await page_soccer.goto(uri_soccer, { waitUntil: 'networkidle2', timeout: 0 });
                await page_soccer.waitForSelector('.item-list');
                const items_soccer = await page_soccer.$$('.post__section-item-display');


                const item = items_soccer[i];
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

                await page_soccer.waitFor(33000);
                await page_soccer.waitForSelector('.post__read-more');
                let button = await page_soccer.$x('//*[@id="content"]/div/main/div/div/div[1]/div/div[2]');

                let ellen = await page_soccer.waitForSelector('.post__read-more');
                const url = (button != null || undefined) ? await ellen.$eval('a', a => a.href) : null;

                const a = url.split("url=");
                const b = a[1];
                const c = b.split("&v=");
                const d = c[0];
                const e = decodeURIComponent(d);

                add_soccer.push({

                    "url": e,
                    "media_link": mediaLink,
                    "headline": headlineText,
                    "tag": tag,
                    "source": publisher,
                    "lede": lede,
                    "time_stamp": timeStamp
                });

            } catch (error) {
                console.log(`From ${uri_soccer} loop: ${error}`.bgMagenta);
            }
        }

        console.log(`Done: ${uri_news}`.bgYellow);
        browser.close();
    } catch (error) {
        console.log(`From ${uri_news} Main: ${error}`.bgRed);
    }

}

let source_news = "https://flipboard.com/@espn";
let source_nba = "https://flipboard.com/@espn/nba-gradfuaqz";
let source_olympics = "https://flipboard.com/@espn/olympics-uo8otjilz";
let source_soccer = "https://flipboard.com/@espn/soccer-l6qk3v8fz";
//
main(source_news, source_nba, source_olympics, source_soccer);
/////////////
espn.get('/espn', (req, res) => {
    res.send({

        "espn": add_news,
        "espnNba": add_nba,
        "espnOlympics": add_olympics,
        "soccer": add_soccer
    });
})

module.exports = espn;
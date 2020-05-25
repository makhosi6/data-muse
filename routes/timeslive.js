const express = require('express');
const timesLiveBusi = express.Router();
const puppeteer = require('puppeteer');
const BROWSER = process.env.BROWSER;
const IS_PRODUCTION = process.env.NODE_ENV === 'production';
///
process.setMaxListeners(Infinity);
//
let add_business = [];
let add_news = [];
let add_sport = [];

async function main(uri_business, uri_news, uri_sport) {
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

        const page_business = await browser.newPage();
        page_business.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.149 Safari/537.36');
        await page_business.goto(uri_business, { waitUntil: 'networkidle2', timeout: 0 });
        await page_business.waitForSelector('.article');
        const items_business = await page_business.$$('.generic-block');
        await page_business.waitFor(125000);
        //

        console.log(items_business.length);
        for (const item of items_business) {
            try {
                console.log('table');
                const get = await item.$('a.image.image-loader');
                const e = await item.$('span.image-loader-image');
                const f = await item.$('.article-text');
                //
                const thumbnail = await page_business.evaluate(a => a.style.backgroundImage, e);

                const link = await page_business.evaluate(a => a.href, get);
                const headline = await item.$eval('.article-title', span => span.innerText);
                const lede = (f != null || undefined) ? await item.$eval('.article-text', a => a.innerText) : null;
                const category = await item.$eval('span.section-title', span => span.innerText);
                //
                let a = thumbnail.split('url("');
                let b = a[1];
                let c = b.split('")');
                let d = c[0];

                const iHtml = await page_business.evaluate(el => el.innerHTML, item);


                add_business.push({

                    "lede": lede,
                    "category": category,
                    "url": link,
                    "thumbnail": d,
                    "headline": headline,
                })
            } catch (error) {
                console.log(`From ${uri_business} loop: ${error}`.bgMagenta);
                continue;

            }
        }
        //
        const page_news = await browser.newPage();
        page_news.setUserAgent('Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML; like Gecko) snap Chromium/80.0.3987.122 Chrome/80.0.3987.122 Safari/537.36');
        await page_news.goto(uri_news, { waitUntil: 'networkidle2', timeout: 0 });
        await page_news.waitForSelector('.article');
        const items_news = await page_news.$$('.horizontal-block > .article');
        await page_news.waitFor(125000);
        //
        for (const item of items_news) {
            try {
                const get = await item.$('a.image.image-loader');
                const e = await item.$('span.image-loader-image');
                //
                const thumbnail = await page_news.evaluate(a => a.style.backgroundImage, e);
                //
                const link = await page_news.evaluate(a => a.href, get);
                const headline = await item.$eval('.article-title', span => span.innerText);
                const lede = await item.$eval('span', a => a.innerText);
                const category = await item.$eval('span.section-title', span => span.innerText);
                //
                let a = thumbnail.split('url("');
                let b = a[1];
                let c = b.split('")');
                let d = c[0];
                //
                const iHtml = await page_news.evaluate(el => el.innerHTML, item);

                add_news.push({

                    "lede": lede,
                    "category": category,
                    "url": link,
                    "thumbnail": d,
                    "headline": headline,
                })
            } catch (error) {
                console.log(`From ${uri_news} loop: ${error}`.bgMagenta);
                continue;

            }
        }
        //
        const page_sport = await browser.newPage();
        page_sport.setUserAgent('Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML; like Gecko) snap Chromium/80.0.3987.122 Chrome/80.0.3987.122 Safari/537.36');

        await page_sport.goto(uri_sport, { waitUntil: 'networkidle2', timeout: 0 });

        await page_sport.waitForSelector('.article');
        //
        const items_sport = await page_sport.$$('.horizontal-block > .article');
        await page_sport.waitFor(125000);
        //
        for (const item of items_sport) {
            try {
                const get = await item.$('a.image.image-loader');
                const e = await item.$('a.image.image-loader > span');
                const thumbnail = await page_sport.evaluate(a => a.style.backgroundImage, e);
                const link = await page_sport.evaluate(a => a.href, get);
                const headline = await item.$eval('.article-title', span => span.innerText);
                const lede = await item.$eval('span', a => a.innerText);
                const category = await item.$eval('span.section-title', span => span.innerText);
                //
                let a = thumbnail.split('url("');
                let b = a[1];
                let c = b.split('")');
                let d = c[0];

                const iHtml = await page_sport.evaluate(el => el.innerHTML, item);

                add_sport.push({

                    "lede": lede,
                    "category": category,
                    "url": link,
                    "thumbnail": d,
                    "headline": headline,
                })
            } catch (error) {
                console.log(`From ${uri_sport} loop: ${error}`.bgMagenta);
                continue;

            }
        }
        //

        //
        console.log(`Done: ${uri_business}`.bgYellow);

        browser.close();
    } catch (error) {
        console.log(`From ${uri_news} Main: ${error}`.bgRed);
    }
}
let source_business = "https://www.timeslive.co.za/sunday-times/business/";
let source_news = "https://www.timeslive.co.za/";
let source_sport = "https://www.timeslive.co.za/sport/";
main(source_business, source_news, source_sport);
/////
timesLiveBusi.get('/times-live', (req, res) => {
    res.send({
        "timesLiveBusi": add_business,
        "timesLive": add_news,
        "timesLiveSport": add_sport
    });
})

module.exports = timesLiveBusi;
const express = require('express');
const enca = express.Router();
require('dotenv').config()
const puppeteer = require('puppeteer');
const BROWSER = process.env.BROWSER;
const IS_PRODUCTION = process.env.NODE_ENV === 'production';
//
process.setMaxListeners(Infinity);
///
let add_sport = [];
let add_video = [];
let add_business = [];
let add_trends = [];

async function main(uri_sport, uri_video, uri_business) {

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

        const page_sport = await browser.newPage();
        page_sport.setUserAgent('Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML; like Gecko) snap Chromium/80.0.3987.122 Chrome/80.0.3987.122 Safari/537.36');

        await page_sport.goto(uri_sport, { waitUntil: 'networkidle2', timeout: 0 });

        await page_sport.waitForSelector('.views-row');

        const items_sport = await page_sport.$$('.views-row');
        await page_sport.waitFor(5000);
        //

        for (const item of items_sport) {
            try {

                const headline = await item.$('h2');
                const image = await item.$('img');
                const sec = await item.$('.para-section-author');
                const para = await item.$('.para-section-text');
                //
                const headlineText = (headline != null || undefined) ? await headline.$eval('a', a => a.innerText) : null;
                const thumbnail = (image != null || undefined) ? await item.$eval('img', img => img.src) : null;
                const url = (headline != null || undefined) ? await headline.$eval('a', a => a.href) : null;
                const lede = (para != null || undefined) ? await para.$eval('div.field-content', div => div.innerText) : null;
                const date = (sec != null || undefined) ? await sec.$eval('span.field-content', span => span.innerText) : null;

                (url === null) ? false: add_sport.push({
                    "url": url,
                    "lede": lede,
                    "headline": headlineText,
                    "thumbnail": thumbnail,
                    "date": date
                });


            } catch (error) {
                console.log(`From ${uri_sport} loop: ${error}`.bgMagenta);
                continue;
            }
        }

        //

        const page_video = await browser.newPage();
        page_video.setUserAgent('Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML; like Gecko) snap Chromium/80.0.3987.122 Chrome/80.0.3987.122 Safari/537.36');

        await page_video.goto(uri_video, { waitUntil: 'networkidle2', timeout: 0 });

        await page_video.waitForSelector('.grid__content');

        const items_video = await page_video.$$('.grid__content');
        await page_video.waitFor(5000);
        //

        for (const item of items_video) {
            // 
            try {
                const headline = await item.$('h2');
                const image = await item.$('img');

                const para = await item.$('.views-field.views-field-field-teaser-text');
                //
                const headlineText = (headline != null || undefined) ? await headline.$eval('a', a => a.innerText) : null;
                const thumbnail = (image != null || undefined) ? await item.$eval('img', img => img.src) : null;
                const url = (headline != null || undefined) ? await headline.$eval('a', a => a.href) : null;
                const lede = (para != null || undefined) ? await para.$eval('div.field-content', div => div.innerText) : null;

                (url === null) ? false: add_video.push({
                    "url": url,
                    "lede": lede,
                    "headline": headlineText,
                    "thumbnail": thumbnail,

                });


            } catch (error) {
                console.log(`From ${uri_video} loop: ${error}`.bgMagenta);
                continue;
            }
        }

        //


        const page_business = await browser.newPage();
        page_business.setUserAgent('Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML; like Gecko) snap Chromium/80.0.3987.122 Chrome/80.0.3987.122 Safari/537.36');

        await page_business.goto(uri_business, { waitUntil: 'networkidle2', timeout: 0 });

        await page_business.waitForXPath('//*[@id="block-views-block-test-business-listing-view-block-4"]/div/div');

        const wrapper = await page_business.$x('//*[@id="block-views-block-test-business-listing-view-block-4"]/div/div');

        const items_business = await page_business.$$('.views-row');
        await page_business.waitFor(5000);
        //
        const trends = await page_sport.$$('.view-content > .trending-list');
        const latest = await page_sport.$$('.trending-story-wrapper > .trending-list');
        //
        for (const trend of latest) {
            const link = await trend.$('a');
            const hed = await trend.$('h4');
            //
            let url = (link != null || undefined) ? await page_sport.evaluate(a => a.href, link) : null;
            let headline = (hed != null || undefined) ? await page_sport.evaluate(a => a.innerText, hed) : null;


            add_trends.push({

                "url": url,
                "headline": headline
            });
        }
        //
        for (const trend of trends) {
            try {
                const link = await trend.$('a');
                //
                let url = (link != null || undefined) ? await page_sport.evaluate(a => a.innerText, link) : null;
                let headline = (link != null || undefined) ? await page_sport.evaluate(a => a.href, link) : null;

                add_trends.push({

                    "url": url,
                    "headline": headline
                });
            } catch (error) {
                console.log(`From ${uri_business} loop: ${error}`.bgMagenta);
            }
        }
        //
        for (const item of items_business) {
            try {
                const headline = await item.$('h2');
                const image = await item.$('img');
                const sec = await item.$('.para-section-author');
                const para = await item.$('.para-section-text');
                //
                const headlineText = (headline != null || undefined) ? await headline.$eval('a', a => a.innerText) : null;
                const thumbnail = (image != null || undefined) ? await item.$eval('img', img => img.src) : null;
                const url = (headline != null || undefined) ? await headline.$eval('a', a => a.href) : null;
                const lede = (para != null || undefined) ? await para.$eval('div.field-content', div => div.innerText) : null;
                const date = (sec != null || undefined) ? await sec.$eval('span.field-content', span => span.innerText) : null;

                (url === null) ? false: add_business.push({
                    "url": url,
                    "lede": lede,
                    "headline": headlineText,
                    "thumbnail": thumbnail,
                    "date": date
                });


            } catch (error) {
                console.log(`From ${uri_business} loop: ${error}`.bgMagenta);
                continue;
            }
        }

        console.log(`Done: ${uri_business}`.bgYellow);

        browser.close();
    } catch (error) {
        console.log(`From ${uri_business} Main: ${error}`.bgRed);
    }

}
let source_sport = "https://www.enca.com/sports";
let source_video = "https://www.enca.com/watch";
let source_business = "https://www.enca.com/business";
main(source_sport, source_video, source_business);
/////////////
enca.get('/enca', (req, res) => {
    res.send({

        "encaSport": add_sport,
        "encaVideo": add_video,
        "encaBusiness": add_business,
        "add_trends": add_trends
    });
})
module.exports = enca;
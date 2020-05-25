const express = require('express');
const ewnRouta = express.Router();
require('dotenv').config()
const puppeteer = require('puppeteer');
const IS_PRODUCTION = process.env.NODE_ENV === 'production';
const BROWSER = process.env.BROWSER;
//
process.setMaxListeners(Infinity);
///
let add_business = [];
let add_lifestyle = [];
let add_politics = [];
let add_sport = [];
let add_trending = [];
//
async function main(uri_business, uri_lifestyle, uri_politics, uri_sport, uri_trending, uri_spt2) {
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
        page_business.setUserAgent('Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML; like Gecko) snap Chromium/80.0.3987.122 Chrome/80.0.3987.122 Safari/537.36');
        await page_business.goto(uri_business, { waitUntil: 'networkidle2', timeout: 0 });
        await page_business.waitForSelector('.article-short');
        const items_business = await page_business.$$('.article-short');
        await page_business.waitFor(5000);
        //Our Error kickOff: Error: Failed to launch the browser process!
        for (const item of items_business) {
            try {
                const check = await item.$('.thumb');
                const left = await item.$('.left');
                if ((check == null) && (left == null)) {

                    const headline = await item.$('h4');
                    const image = await item.$('img');
                    const thumbnail = (image != null || undefined) ? await item.$eval('img', img => img.src) : null;
                    const url = await headline.$eval('a', a => a.href);
                    //
                    const headlineText = await headline.$eval('a', a => a.innerText);
                    //
                    const para = await item.$('p.lead');
                    const lede = (para != null || undefined) ? await item.$eval('p', p => p.innerText) : null;
                    const date = await item.$eval('abbr', abbr => abbr.innerText);

                    add_business.push({
                        "url": url,
                        "lede": lede,
                        "headline": headlineText,
                        "thumbnail": thumbnail,
                        "date": date
                    })
                }

            } catch (error) {
                console.log(`From ${uri_business} loop: ${error}`.bgMagenta);
                continue;
            }

        }
        //
        const page_lifestyle = await browser.newPage();
        page_lifestyle.setUserAgent('Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML; like Gecko) snap Chromium/80.0.3987.122 Chrome/80.0.3987.122 Safari/537.36');
        await page_lifestyle.goto(uri_lifestyle, { waitUntil: 'networkidle2', timeout: 0 });
        await page_lifestyle.waitForSelector('.article-short');
        const items_lifestyle = await page_lifestyle.$$('.article-short');
        await page_lifestyle.waitFor(5000);
        //
        for (const item of items_lifestyle) {
            try {
                const check = await item.$('.thumb');
                const left = await item.$('.left');
                if ((check == null) && (left == null)) {

                    const headline = await item.$('h4');
                    const image = await item.$('img');
                    const thumbnail = (image != null || undefined) ? await item.$eval('img', img => img.src) : null;
                    const url = await headline.$eval('a', a => a.href);
                    //
                    const headlineText = await headline.$eval('a', a => a.innerText);
                    //
                    const para = await item.$('p.lead');
                    const lede = (para != null || undefined) ? await item.$eval('p', p => p.innerText) : null;
                    const date = await item.$eval('abbr', abbr => abbr.innerText);

                    add_lifestyle.push({
                        "url": url,
                        "lede": lede,
                        "headline": headlineText,
                        "thumbnail": thumbnail,

                        "date": date
                    })

                }
            } catch (error) {
                console.log(`From ${uri_lifestyle} loop: ${error}`.bgMagenta);
                continue;
            }


        }
        ///
        const page_politics = await browser.newPage();
        page_politics.setUserAgent('Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML; like Gecko) snap Chromium/80.0.3987.122 Chrome/80.0.3987.122 Safari/537.36');
        await page_politics.goto(uri_politics, { waitUntil: 'networkidle2', timeout: 0 });
        await page_politics.waitForSelector('.article-short');
        const items_politics = await page_politics.$$('.article-short');
        await page_politics.waitFor(5000);
        //
        for (const item of items_politics) {
            try {
                const check = await item.$('.thumb');
                const left = await item.$('.left');
                if ((check == null) && (left == null)) {

                    const headline = await item.$('h4');
                    const image = await item.$('img');
                    const thumbnail = (image != null || undefined) ? await item.$eval('img', img => img.src) : null;
                    const url = await headline.$eval('a', a => a.href);
                    //
                    const headlineText = await headline.$eval('a', a => a.innerText);
                    //
                    const para = await item.$('p.lead');
                    const lede = (para != null || undefined) ? await item.$eval('p', p => p.innerText) : null;
                    const date = await item.$eval('abbr', abbr => abbr.innerText);

                    add_politics.push({
                        "url": url,
                        "lede": lede,
                        "headline": headlineText,
                        "thumbnail": thumbnail,
                        "date": date
                    })
                }

            } catch (error) {
                console.log(`From ${uri_politics} loop: ${error}`.bgMagenta);
                continue;
            }
        }
        //
        const page_spt = await browser.newPage();
        page_spt.setUserAgent('Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML; like Gecko) snap Chromium/80.0.3987.122 Chrome/80.0.3987.122 Safari/537.36');
        await page_spt.goto(uri_spt2, { waitUntil: 'networkidle2', timeout: 0 });
        await page_spt.waitForSelector('.article-short');
        const items_spt = await page_spt.$$('.article-short');
        for (const item of items_spt) {
            try {
                const check = await item.$('.thumb');
                const left = await item.$('.left');
                if ((check == null) && (left == null)) {

                    const headline = await item.$('h4');
                    const image = await item.$('img');
                    const thumbnail = (image != null || undefined) ? await item.$eval('img', img => img.src) : null;
                    const url = await headline.$eval('a', a => a.href);
                    //
                    const headlineText = await headline.$eval('a', a => a.innerText);
                    //
                    // const cat = await item.$('div.category');
                    // const category = (cat != null || undefined) ? await item.$eval('div.category', div => div.innerText) : null;
                    //
                    const para = await item.$('p.lead');
                    const lede = (para != null || undefined) ? await item.$eval('p', p => p.innerText) : null;
                    const date = await item.$eval('abbr', abbr => abbr.innerText);


                    add_sport.push({
                        "url": url,
                        "lede": lede,
                        "headline": headlineText,
                        "thumbnail": thumbnail,
                        "date": date
                    })
                }

            } catch (error) {
                console.log(`From ${uri_sport} loop@2: ${error}`.bgMagenta);
                continue;
            }


        }

        //
        const page_sport = await browser.newPage();
        page_sport.setUserAgent('Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML; like Gecko) snap Chromium/80.0.3987.122 Chrome/80.0.3987.122 Safari/537.36');
        await page_sport.goto(uri_sport, { waitUntil: 'networkidle2', timeout: 0 });
        await page_sport.waitForSelector('.article-short');
        const items_sport = await page_sport.$$('.article-short');
        await page_sport.waitFor(5000);
        //
        for (const item of items_sport) {
            try {
                const check = await item.$('.thumb');
                const left = await item.$('.left');
                if ((check == null) && (left == null)) {

                    const headline = await item.$('h4');
                    const image = await item.$('img');
                    const thumbnail = (image != null || undefined) ? await item.$eval('img', img => img.src) : null;
                    const url = await headline.$eval('a', a => a.href);
                    //
                    const headlineText = await headline.$eval('a', a => a.innerText);
                    //
                    // const cat = await item.$('div.category');
                    // const category = (cat != null || undefined) ? await item.$eval('div.category', div => div.innerText) : null;
                    //
                    const para = await item.$('p.lead');
                    const lede = (para != null || undefined) ? await item.$eval('p', p => p.innerText) : null;
                    const date = await item.$eval('abbr', abbr => abbr.innerText);

                    add_sport.push({
                        "url": url,
                        "lede": lede,
                        "headline": headlineText,
                        "thumbnail": thumbnail,
                        "date": date
                    })
                }

            } catch (error) {
                console.log(`From ${uri_sport} loop: ${error}`.bgMagenta);
                continue;
            }


        }


        ///


        const page_trending = await browser.newPage();
        page_trending.setUserAgent('Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML; like Gecko) snap Chromium/80.0.3987.122 Chrome/80.0.3987.122 Safari/537.36');

        await page_trending.goto(uri_trending, { waitUntil: 'networkidle2', timeout: 0 });

        await page_trending.waitForSelector(".most-popular.track-mostpopular");
        const wrapper = await page_trending.$(".most-popular.track-mostpopular");

        const items_trending = await wrapper.$$('li');
        await page_trending.waitFor(5000);
        //
        for (const item of items_trending) {
            try {
                const url = await item.$eval('a', a => a.href);
                //
                const headline = await item.$eval('a', a => a.innerText);

                add_trending.push({
                    "url": url,
                    "headline": headline
                })

            } catch (error) {
                console.log(`From ${uri_trending} loop: ${error}`.bgMagenta);
                continue;
            }

        }


        console.log(`Done: ${uri_business}`.bgYellow);

        browser.close();
    } catch (error) {
        console.log(`From ${uri_trending} Main: ${error}`.bgRed);
    }

}
let source_business = "https://ewn.co.za/categories/business";
let source_lifestyle = "https://ewn.co.za/categories/lifestyle";
let source_politics = "https://ewn.co.za/categories/politics";
let source_sport = "https://ewn.co.za/categories/sport";
let source_trending = "https://ewn.co.za/";
let source_spt2 = "https://ewn.co.za/categories/sport?pagenumber=2&perPage=30";

main(source_business, source_lifestyle, source_politics, source_sport, source_trending, source_spt2);
/////////////
ewnRouta.get('/ewn', (req, res) => {
    res.send({
        "ewnNews": add_business,
        "ewnLifestyle": add_lifestyle,
        "ewnPolitics": add_politics,
        "ewnSport": add_sport,
        "ewnTrending": add_trending
    });
})

module.exports = ewnRouta;
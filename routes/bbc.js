const express = require('express');
const bbcBusiness = express.Router();
const puppeteer = require('puppeteer');
const BROWSER = process.env.BROWSER;
require('dotenv').config()
const IS_PRODUCTION = process.env.NODE_ENV === 'production';
process.setMaxListeners(Infinity);
let data_news = [];
let data_health = [];
let data_africa = [];
let data_real = [];
let data_sport = [];
let data_tech = [];
//
async function puppet(uri_news, uri_africa, uri_health, url_real, uri_sport, uri_tech) {
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
        await page_news.waitForSelector('#index-page');
        const section_news = await page_news.$('#index-page');
        const items_news = await section_news.$$('.gs-c-promo')
        await page_news.waitFor(5000);

        for (const item of items_news) {
            try {
                const body = item;
                const media = await item.$('.gs-c-promo-image');
                const para = await item.$('.gs-c-promo-summary');
                const el = await body.$('.nw-c-promo-meta');
                const cont = await body.$('.qa-time');
                const sect = (body != null || undefined) ? await body.$('.gs-c-section-link') : null;
                //
                const mediaLink = (media != null || undefined) ? await media.$eval('img', img => img.src) : null;
                const value = (mediaLink != null || undefined) ? await item.$eval('img', img => img.dataset.src) : null;
                const url = (body != null || undefined) ? await body.$eval('a', a => a.href) : null;
                const heading = (body != null || undefined) ? await body.$eval('h3', h3 => h3.innerText) : null;
                const timeStamp = (el != null || undefined) ? await body.$eval('span.qa-status-date-output', span => span.innerText) : null;
                const vidLen = (cont != null) ? await body.$eval('span.qa-onscreen', span => span.innerText) : null;
                const bool = (vidLen != null || undefined) ? true : false;
                const cat = (el != null || undefined) ? await sect.$eval('span', span => span.innerText) : null;
                const lede = ((para != null || undefined) && (media != null || undefined)) ? await body.$eval('p', p => p.innerText) : null;
                //
                let slc = url.slice(21, 31)
                const category = (slc == "programmes") ? "programmes" : cat;
                let thumbnail = (value != null) ? value.replace("{width}", "490") : null;
                //
                data_news.push({
                    "thumbnail": thumbnail,
                    "url": url,
                    "heading": heading,
                    "isVid": bool,
                    "vidLen": vidLen,
                    "timestamp": timeStamp,
                    "category": category,
                    "lede": lede,

                })
            } catch (error) {
                console.log(`From ${uri_news} loop: ${error}`.bgMagenta);
                continue;
            }
        }
        //
        const page_africa = await browser.newPage();
        page_africa.setUserAgent('Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML; like Gecko) snap Chromium/80.0.3987.122 Chrome/80.0.3987.122 Safari/537.36');
        await page_africa.goto(uri_africa, { waitUntil: 'networkidle2', timeout: 0 });
        await page_africa.waitForSelector('#index-page');
        const section_africa = await page_africa.$('#index-page');
        const items_africa = await section_africa.$$('.gs-c-promo');
        await page_africa.waitFor(5000);
        for (const item of items_africa) {
            try {
                const body = item;
                const media = await item.$('.gs-c-promo-image');
                const para = await item.$('.gs-c-promo-summary');
                const el = await body.$('.nw-c-promo-meta');
                const time = (el != null || undefined) ? await el.$('time') : null;
                const cont = await body.$('.qa-time');
                const sect = (body != null || undefined) ? await body.$('.gs-c-section-link') : null;
                //
                const mediaLink = (media != null || undefined) ? await media.$eval('img', img => img.src) : null;
                const value = (mediaLink != null || undefined) ? await item.$eval('img', img => img.dataset.src) : null;
                const url = (body != null || undefined) ? await body.$eval('a', a => a.href) : null;
                const heading = (body != null || undefined) ? await body.$eval('h3', h3 => h3.innerText) : null;
                const timeStamp = ((el != null || undefined) && (time != null || undefined)) ? await time.$eval('span.qa-status-date-output', span => span.innerText) : null;
                const vidLen = (cont != null) ? await body.$eval('span.qa-onscreen', span => span.innerText) : null;
                const bool = (vidLen != null || undefined) ? true : false;
                const cat = (el != null || undefined) ? await sect.$eval('span', span => span.innerText) : null;
                const lede = ((para != null || undefined) && (media != null || undefined)) ? await body.$eval('p', p => p.innerText) : null;
                //
                let slc = url.slice(21, 31);
                const category = (slc == "programmes") ? "programmes" : cat;
                let thumbnail = (value != null) ? value.replace("{width}", "490") : null;
                //
                data_africa.push({
                    "thumbnail": thumbnail,
                    "url": url,
                    "heading": heading,
                    "isVid": bool,
                    "vidLen": `${vidLen}`,
                    "timestamp": timeStamp,
                    "category": category,
                    "lede": lede,

                })
            } catch (error) {
                console.log(`From ${uri_africa} loop: ${error}`.bgMagenta);
                continue;
            }
        }
        //
        const page_health = await browser.newPage();
        page_health.setUserAgent('Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML; like Gecko) snap Chromium/80.0.3987.122 Chrome/80.0.3987.122 Safari/537.36');
        await page_health.goto(uri_health, { waitUntil: 'networkidle2', timeout: 0 });
        await page_health.waitForSelector('.gel-wrap');
        const section_health = await page_health.$('#index-page');
        const items_health = await section_health.$$('.gs-c-promo');
        await page_health.waitFor(5000);
        for (const item of items_health) {
            try {
                const body = item;
                const media = await item.$('.gs-c-promo-image');
                const para = await item.$('.gs-c-promo-summary');
                const sect = (body != null || undefined) ? await item.$('.gs-c-section-link') : null;
                const cont = await body.$('.qa-time');
                const el = await body.$('.nw-c-promo-meta');

                const mediaLink = (media != null || undefined) ? await media.$eval('img', img => img.src) : null;
                const value = (mediaLink != null || undefined) ? await item.$eval('img', img => img.dataset.src) : null;
                const url = (body != null || undefined) ? await body.$eval('a', a => a.href) : null;
                const heading = (body != null || undefined) ? await body.$eval('h3', h3 => h3.innerText) : null;
                const timeStamp = (el != null || undefined) ? await body.$eval('span.qa-status-date-output', span => span.innerText) : null;
                const vidLen = ((cont != null) && (body != null || undefined)) ? await body.$eval('span.qa-onscreen', span => span.innerText) : null;
                const bool = (vidLen != null || undefined) ? true : false;
                const cat = (el != null || undefined) ? await sect.$eval('span', span => span.innerText) : null;
                const lede = ((para != null || undefined) && (media != null || undefined)) ? await body.$eval('p', p => p.innerText) : null;
                //
                let slc = url.slice(21, 31)
                let thumbnail = (value != null) ? value.replace("{width}", "490") : null;
                const category = (slc == "programmes") ? "programmes" : cat;

                data_health.push({
                    "thumbnail": thumbnail,
                    "url": url,
                    "heading": heading,
                    "isVid": bool,
                    "vidLen": `${vidLen}`,
                    "timestamp": timeStamp,
                    "category": category,
                    "lede": lede,

                })
            } catch (error) {
                console.log(`From ${uri_health} loop: ${error}`.bgMagenta);
                continue;
            }
        }
        //
        const page_real = await browser.newPage();
        page_real.setUserAgent('Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML; like Gecko) snap Chromium/80.0.3987.122 Chrome/80.0.3987.122 Safari/537.36');
        await page_real.goto(url_real, { waitUntil: 'networkidle2', timeout: 0 });
        await page_real.waitForSelector('#index-page');
        const section_real = await page_real.$('#index-page');
        const items_real = await section_real.$$('.gs-c-promo');
        await page_real.waitFor(5000);
        for (const item of items_real) {
            try {
                const body = item;
                const el = await body.$('.nw-c-promo-meta');
                const media = await item.$('.gs-c-promo-image');
                const sect = (body != null || undefined) ? await body.$('.gs-c-section-link') : null;
                const cont = await body.$('span.qa-onscreen');
                const para = await item.$('.gs-c-promo-summary');

                //
                const mediaLink = (media != null || undefined) ? await media.$eval('img', img => img.src) : null;
                const value = (mediaLink != null || undefined) ? await item.$eval('img', img => img.dataset.src) : null;
                const url = (body != null || undefined) ? await body.$eval('a', a => a.href) : null;
                const heading = (body != null || undefined) ? await body.$eval('h3', h3 => h3.innerText) : null;
                const timeStamp = (el != null || undefined) ? await body.$eval('span.qa-status-date-output', span => span.innerText) : null;

                const vidLen = (cont != null) ? await body.$eval('span.qa-onscreen', span => span.innerText) : null;
                const bool = (vidLen != null || undefined) ? true : false;
                const cat = (el != null || undefined) ? await sect.$eval('span', span => span.innerText) : null;
                const lede = ((para != null || undefined) && (media != null || undefined)) ? await body.$eval('p', p => p.innerText) : null;
                //
                let slc = url.slice(21, 31)
                let thumbnail = (value != null) ? value.replace("{width}", "490") : null;
                const category = (slc == "programmes") ? "programmes" : cat;

                data_real.push({
                    "thumbnail": thumbnail,
                    "url": url,
                    "heading": heading,
                    "isVid": bool,
                    "vidLen": `${vidLen}`,
                    "timestamp": timeStamp,
                    "category": category,
                    "lede": lede,

                })

            } catch (error) {
                console.log(`From ${url_real} loop: ${error}`.bgMagenta);
                continue;
            }
        }
        //
        const page_sport = await browser.newPage();
        page_sport.setUserAgent('Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML; like Gecko) snap Chromium/80.0.3987.122 Chrome/80.0.3987.122 Safari/537.36');
        await page_sport.goto(uri_sport, { waitUntil: 'networkidle2', timeout: 0 });
        await page_sport.waitFor(15000);
        await page_sport.waitForSelector('.gs-c-promo');
        const items_sport = await page_sport.$$('.gs-c-promo');
        await page_sport.waitFor(5000);
        for (const item of items_sport) {
            try {
                const body = item;
                const el = await body.$('.nw-c-promo-meta');
                const media = await item.$('.gs-c-promo-image');
                const time = (el != null || undefined) ? await el.$('time') : null;
                const para = await item.$('.gs-c-promo-summary');
                const cont = await body.$('.qa-time');
                const sect = (body != null || undefined) ? await body.$('.gs-c-section-link') : null;
                //
                const mediaLink = (media != null || undefined) ? await media.$eval('img', img => img.src) : null;
                const value = await item.$eval('img', img => img.dataset.src);
                const url = (body != null || undefined) ? await body.$eval('a', a => a.href) : null;
                const heading = (body != null || undefined) ? await body.$eval('h3', h3 => h3.innerText) : null;
                const timeStamp = ((el != null || undefined) && (time != null || undefined)) ? await time.$eval('span.qa-status-date-output', span => span.innerText) : null;
                const vidLen = (cont != null) ? await body.$eval('span.qa-onscreen', span => span.innerText) : null;
                const bool = (vidLen != null || undefined) ? true : false;
                const cat = (el != null || undefined) ? await sect.$eval('span', span => span.innerText) : null;
                const lede = ((para != null || undefined) && (media != null || undefined)) ? await body.$eval('p', p => p.innerText) : null;
                //
                let slc = url.slice(21, 31)
                let thumbnail = (value != null) ? value.replace("{width}", "490") : null;
                const category = (slc == "programmes") ? "programmes" : cat;

                data_sport.push({
                    "thumbnail": thumbnail,
                    "url": url,
                    "heading": heading,
                    "isVid": bool,
                    "vidLen": `${vidLen}`,
                    "timestamp": timeStamp,
                    "category": category,
                    "lede": lede,

                })
            } catch (error) {
                console.log(`From ${uri_sport} loop: ${error}`.bgMagenta);

            }
        }
        //
        const page_tech = await browser.newPage();
        page_tech.setUserAgent('Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML; like Gecko) snap Chromium/80.0.3987.122 Chrome/80.0.3987.122 Safari/537.36');
        await page_tech.goto(uri_tech, { waitUntil: 'networkidle2', timeout: 0 });
        await page_tech.waitForSelector('.gel-wrap');
        const section_tech = await page_tech.$('#index-page');
        const items_tech = await section_tech.$$('.gs-c-promo');
        await page_tech.waitFor(5000);
        //
        for (const item of items_tech) {
            try {
                const body = item;
                const el = await body.$('.nw-c-promo-meta');
                const media = await item.$('.gs-c-promo-image');
                const cont = await body.$('.qa-time');
                const para = await item.$('.gs-c-promo-summary');
                const sect = (body != null || undefined) ? await body.$('.gs-c-section-link') : null;

                //
                const mediaLink = (media != null || undefined) ? await media.$eval('img', img => img.src) : null;
                const value = (mediaLink != null || undefined) ? await item.$eval('img', img => img.dataset.src) : null;
                const url = (body != null || undefined) ? await body.$eval('a', a => a.href) : null;
                const heading = (body != null || undefined) ? await body.$eval('h3', h3 => h3.innerText) : null;
                const timeStamp = (el != null || undefined) ? await body.$eval('span.qa-status-date-output', span => span.innerText) : null;
                const vidLen = (cont != null) ? await body.$eval('span.qa-onscreen', span => span.innerText) : null;
                const bool = (vidLen != null || undefined) ? true : false;
                const cat = (el != null || undefined) ? await sect.$eval('span', span => span.innerText) : null;
                const lede = ((para != null || undefined) && (media != null || undefined)) ? await body.$eval('p', p => p.innerText) : null;
                //
                let slc = url.slice(21, 31)
                const category = (slc == "programmes") ? "programmes" : cat;
                let thumbnail = (value != null) ? value.replace("{width}", "490") : null;
                //
                data_tech.push({
                    "thumbnail": thumbnail,
                    "url": url,
                    "heading": heading,
                    "isVid": bool,
                    "vidLen": `${vidLen}`,
                    "timestamp": timeStamp,
                    "category": category,
                    "lede": lede,

                })


            } catch (error) {
                console.log(`From ${uri_tech} loop: ${error}`.bgMagenta);
                continue;
            }
        }
        //
        console.log(`Done: ${uri_news}`.bgYellow);
        browser.close();
    } catch (error) {
        console.log(`From ${uri_health} Main: ${error}`.bgRed);
    }
}
//
let source_news = "https://www.bbc.com/news/business";
let source_africa = "https://www.bbc.com/news/world/africa";
let source_health = "https://www.bbc.com/news/health";
let source_real = "https://www.bbc.com/news/reality_check";
let source_sport = "https://www.bbc.com/sport";
let source_tech = "https://www.bbc.com/news/technology";
//
puppet(source_news, source_africa, source_health, source_real, source_sport, source_tech);

bbcBusiness.get('/bbc', (req, res) => {
    res.send({
        "africa": data_africa,
        "business_news": data_news,
        "real": data_real,
        "health": data_health,
        "sport": data_sport,
        "tech": data_tech
    });
})
module.exports = bbcBusiness;
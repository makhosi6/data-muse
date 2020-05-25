const express = require('express');
const cnnRouta = express.Router();
require('dotenv').config()
const BROWSER = process.env.BROWSER;
const puppeteer = require('puppeteer');
const IS_PRODUCTION = process.env.NODE_ENV === 'production';
//
process.setMaxListeners(Infinity);
///
let add_world = [];
let add_africa = [];
let add_tech = [];
let add_health = [];
let add_business = [];
//
async function main(uri_world, uri_africa, uri_tech, uri_health, uri_business) {
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
        const page_world = await browser.newPage();
        page_world.setUserAgent('Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML; like Gecko) snap Chromium/80.0.3987.122 Chrome/80.0.3987.122 Safari/537.36');
        await page_world.goto(uri_world, { waitUntil: 'networkidle2', timeout: 0 });
        await page_world.waitForSelector('.cd__wrapper');
        const items_world = await page_world.$$('.cd__wrapper');
        //
        await page_world.waitFor(5000);
        for (const item of items_world) {
            try {
                const sub = await item.$('.cd__content');
                // CATEGORY
                const subText = await sub.$eval('h3', h3 => h3.dataset.analytics);
                const str = await subText.split("_");
                const first = await str[0];
                const sec = await str[2];
                const category = (first != "") ? await first : null;
                const hasVid = (sec == "video") ? true : false;
                //VALUES
                const headline = await item.$('.cd__headline');
                const media = await item.$('.media');
                //
                const headlineText = await headline.$eval('span', span => span.innerText);
                const link = await headline.$eval('a', a => a.href);
                const mediaLink = (media != null || undefined) ? await media.$eval('a', a => a.href) : null;
                const image = (media != null || undefined) ? await media.$('.media__image') : null;
                const thumbnail = ((media != null || undefined) && (image != null || undefined)) ? await media.$eval('img', img => img.dataset.src) : null;

                add_world.push({
                    "category": category,
                    "url": link,
                    "has video": hasVid,
                    "media url": mediaLink,
                    "thumbnail": thumbnail,
                    "headline": headlineText
                })


            } catch (error) {
                console.log(`From ${uri_world} loop: ${error}`.bgMagenta);
                continue;
            }
        }
        //

        const page_africa = await browser.newPage();
        page_africa.setUserAgent('Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML; like Gecko) snap Chromium/80.0.3987.122 Chrome/80.0.3987.122 Safari/537.36');
        await page_africa.goto(uri_africa, { waitUntil: 'networkidle2', timeout: 0 });
        await page_africa.waitForSelector('.cd__wrapper');
        const items_africa = await page_africa.$$('.cd__wrapper');
        await page_africa.waitFor(5000);
        //
        for (const item of items_africa) {
            try {
                const sub = await item.$('.cd__content');
                // CATEGORY
                const subText = await sub.$eval('h3', h3 => h3.dataset.analytics);
                const str = await subText.split("_");
                const first = await str[0];
                const sec = await str[2];
                const category = (first != "") ? await first : null;
                const hasVid = (sec == "video") ? true : false;
                //VALUES
                const headline = await item.$('.cd__headline');
                const media = await item.$('.media');
                const headlineText = await headline.$eval('span', span => span.innerText);
                const link = await headline.$eval('a', a => a.href);
                const mediaLink = (media != null || undefined) ? await media.$eval('a', a => a.href) : null;
                const image = (media != null || undefined) ? await media.$('.media__image') : null;
                const thumbnail = ((media != null || undefined) && (image != null || undefined)) ? await media.$eval('img', img => img.dataset.src) : null;

                add_africa.push({
                    "category": category,
                    "url": link,
                    "has video": hasVid,
                    "media url": mediaLink,
                    "thumbnail": thumbnail,
                    "headline": headlineText
                })

            } catch (error) {
                console.log(`From ${uri_africa} loop: ${error}`.bgMagenta);
                continue;
            }
        }

        //

        const page_tech = await browser.newPage();
        page_tech.setUserAgent('Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML; like Gecko) snap Chromium/80.0.3987.122 Chrome/80.0.3987.122 Safari/537.36');
        await page_tech.goto(uri_tech, { waitUntil: 'networkidle2', timeout: 0 });
        await page_tech.waitForSelector('.cd__wrapper');
        const items_tech = await page_tech.$$('.cd__wrapper');
        //
        await page_tech.waitFor(5000);
        for (const item of items_tech) {
            try {
                const sub = await item.$('.cd__content');
                // CATEGORY
                const subText = await sub.$eval('h3', h3 => h3.dataset.analytics);
                const str = await subText.split("_");
                const first = await str[0];
                const sec = await str[2];
                const category = (first != "") ? await first : null;
                const hasVid = (sec == "video") ? true : false;
                //VALUES
                const headline = await item.$('.cd__headline');
                const media = await item.$('.media');
                const headlineText = await headline.$eval('span', span => span.innerText);
                const link = await headline.$eval('a', a => a.href);
                const mediaLink = (media != null || undefined) ? await media.$eval('a', a => a.href) : null;
                const image = (media != null || undefined) ? await media.$('.media__image') : null;
                const thumbnail = ((media != null || undefined) && (image != null || undefined)) ? await media.$eval('img', img => img.dataset.src) : null;

                add_tech.push({
                    "category": category,
                    "url": link,
                    "has video": hasVid,
                    "media url": mediaLink,
                    "thumbnail": thumbnail,
                    "headline": headlineText
                })


            } catch (error) {
                console.log(`From ${uri_tech} loop: ${error}`.bgMagenta);
                continue;
            }
        }

        //
        const page_health = await browser.newPage();
        page_health.setUserAgent('Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML; like Gecko) snap Chromium/80.0.3987.122 Chrome/80.0.3987.122 Safari/537.36');
        await page_health.goto(uri_health, { waitUntil: 'networkidle2', timeout: 0 });
        await page_health.waitForSelector('.cd__wrapper');
        const items_health = await page_health.$$('.cd__wrapper');
        //
        await page_health.waitFor(5000);
        for (const item of items_health) {
            try {
                const sub = await item.$('.cd__content');
                // CATEGORY
                const subText = await sub.$eval('h3', h3 => h3.dataset.analytics);
                const str = await subText.split("_");
                const first = await str[0];
                const sec = await str[2];
                const category = (first != "") ? await first : null;
                const hasVid = (sec == "video") ? true : false;
                //VALUES
                const headline = await item.$('.cd__headline');
                const media = await item.$('.media');
                const headlineText = await headline.$eval('span', span => span.innerText);
                const link = await headline.$eval('a', a => a.href);
                const mediaLink = (media != null || undefined) ? await media.$eval('a', a => a.href) : null;
                const image = (media != null || undefined) ? await media.$('.media__image') : null;
                const thumbnail = ((media != null || undefined) && (image != null || undefined)) ? await media.$eval('img', img => img.dataset.src) : null;

                add_health.push({
                    "category": category,
                    "url": link,
                    "has video": hasVid,
                    "media url": mediaLink,
                    "thumbnail": thumbnail,
                    "headline": headlineText
                })


            } catch (error) {
                console.log(`From ${uri_health} loop: ${error}`.bgMagenta);
                continue;
            }
        }

        //

        const page_business = await browser.newPage();
        page_business.setUserAgent('Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML; like Gecko) snap Chromium/80.0.3987.122 Chrome/80.0.3987.122 Safari/537.36');
        await page_business.goto(uri_business, { waitUntil: 'networkidle2', timeout: 0 });
        await page_business.waitForSelector('.cd__wrapper');
        const items_business = await page_business.$$('.cd__wrapper');
        //
        await page_business.waitFor(5000);
        for (const item of items_business) {
            try {
                const sub = await item.$('.cd__content');
                // CATEGORY
                const subText = await sub.$eval('h3', h3 => h3.dataset.analytics);
                const str = await subText.split("_");
                const first = await str[0];
                const sec = await str[2];
                const category = (first != "") ? await first : null;
                const hasVid = (sec == "video") ? true : false;
                //VALUES
                const headline = await item.$('.cd__headline');
                const media = await item.$('.media');
                const headlineText = await headline.$eval('span', span => span.innerText);
                const link = await headline.$eval('a', a => a.href);
                const mediaLink = (media != null || undefined) ? await media.$eval('a', a => a.href) : null;
                const image = (media != null || undefined) ? await media.$('.media__image') : null;
                const thumbnail = ((media != null || undefined) && (image != null || undefined)) ? await media.$eval('img', img => img.dataset.src) : null;

                add_business.push({
                    "category": category,
                    "url": link,
                    "has video": hasVid,
                    "media url": mediaLink,
                    "thumbnail": thumbnail,
                    "headline": headlineText
                })


            } catch (error) {
                console.log(`From ${uri_business} loop: ${error}`.bgMagenta);
                continue;
            }
        }

        //
        console.log(`Done: ${uri_world}`.bgYellow);
        browser.close();
    } catch (error) {
        console.log(`From ${uri_business} Main: ${error}`.bgRed);
    }

}

let source_world = "https://edition.cnn.com/world";
let source_africa = "https://edition.cnn.com/africa";
let source_tech = "https://edition.cnn.com/business/tech";
let source_health = "https://edition.cnn.com/health";
let source_business = "https://edition.cnn.com/business";
//
main(source_world, source_africa, source_tech, source_health, source_business);
/////////////
cnnRouta.get('/cnn', (req, res) => {
    res.send({

        "world": add_world,
        "africa": add_africa,
        "tech": add_tech,
        "world": add_health,
        "business": add_business
    });
})

module.exports = cnnRouta;
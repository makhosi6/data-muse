const express = require('express');
const wiredBusiness = express.Router();
const puppeteer = require('puppeteer');
require('dotenv').config()
const BROWSER = process.env.BROWSER;
const IS_PRODUCTION = process.env.NODE_ENV === 'production';
///
process.setMaxListeners(Infinity);
//
let add_business = [];
let add_science = [];
let add_gear = [];

async function main(uri_business, uri_science, uri_gear) {

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
        await page_business.waitForSelector('.card-component ul');
        const items_business = await page_business.$$('.card-component ul');
        await page_business.waitFor(5000);
        //
        for (const item of items_business) {
            try {
                const thumbnail = await item.$eval('img', img => img.src);
                const link = await item.$eval('a', a => a.href);
                const headline = await item.$eval('h2', h2 => h2.innerText);
                const author = await item.$eval('a.byline-component__link', a => a.innerText);
                const category = await item.$eval('span.brow-component--micro', span => span.innerText);
                add_business.push({
                    "category": category,
                    "url": link,
                    "thumbnail": thumbnail,
                    "headline": headline,
                    "author": author
                })
            } catch (error) {
                console.log(`From ${uri_business} loop: ${error}`.bgMagenta);
                continue;
            }
        }
        // ANOTHER ONE

        const page_science = await browser.newPage();
        page_science.setUserAgent('Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML; like Gecko) snap Chromium/80.0.3987.122 Chrome/80.0.3987.122 Safari/537.36');
        await page_science.goto(uri_science, { waitUntil: 'networkidle2', timeout: 0 });
        await page_science.waitForSelector('.card-component ul');
        const items_science = await page_science.$$('.card-component ul');
        await page_science.waitFor(5000);
        //
        for (const item of items_science) {
            try {
                const thumbnail = await item.$eval('img', img => img.src);
                const link = await item.$eval('a', a => a.href);
                const headline = await item.$eval('h2', h2 => h2.innerText);
                const author = await item.$eval('a.byline-component__link', a => a.innerText);
                const category = await item.$eval('span.brow-component--micro', span => span.innerText);
                add_science.push({
                    "category": category,
                    "url": link,
                    "thumbnail": thumbnail,
                    "headline": headline,
                    "author": author
                })

            } catch (error) {
                console.log(`From ${uri_business} loop: ${error}`.bgMagenta);
                continue;

            }
        }

        const page_gear = await browser.newPage();
        page_gear.setUserAgent('Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML; like Gecko) snap Chromium/80.0.3987.122 Chrome/80.0.3987.122 Safari/537.36');
        await page_gear.goto(uri_gear, { waitUntil: 'networkidle2', timeout: 0 });
        await page_gear.waitForSelector('.card-component ul');
        const items_gear = await page_gear.$$('.card-component ul');
        await page_gear.waitFor(5000);
        //
        for (const item of items_gear) {
            try {
                const thumbnail = await item.$eval('img', img => img.src);
                const link = await item.$eval('a', a => a.href);
                const headline = await item.$eval('h2', h2 => h2.innerText);
                const author = await item.$eval('a.byline-component__link', a => a.innerText);
                const category = await item.$eval('span.brow-component--micro', span => span.innerText);

                add_gear.push({
                    "category": category,
                    "url": link,
                    "thumbnail": thumbnail,
                    "headline": headline,
                    "author": author
                })

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
let source_science = "https://www.wired.com/category/science/";
let source_business = "https://www.wired.com/category/business/";
let source_gear = "https://www.wired.com/category/gear/";


main(source_business, source_science, source_gear);
///
wiredBusiness.get('/wired-all', (req, res) => {
    res.send({
        "wiredScience": add_science,
        "wiredBusiness": add_business,
        "wiredGear": add_gear
    });
})

module.exports = wiredBusiness;
const express = require('express');
const africa = express.Router();
require('dotenv').config()
const puppeteer = require('puppeteer');
var colors = require('colors');
///
process.setMaxListeners(Infinity);
//
let add = [];
console.log(__dirname)
console.log(__filename)
async function main(uri) {
    try {
        const browser = await puppeteer.launch({
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
            // executablePath: '/app/node_modules/puppeteer/.local-chromium/linux-706915/chrome-linux/chrome.exe'
            // executablePath: './node_modules/puppeteer/.local-chromium/linux-706915/chrome-linux/chrome.exe'

        });
        /*
        
        */
        const page = await browser.newPage();
        page.setUserAgent('Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML; like Gecko) snap Chromium/80.0.3987.122 Chrome/80.0.3987.122 Safari/537.36');
        await page.goto(uri, { waitUntil: 'networkidle2', timeout: 0 });
        await page.waitFor(125000);
        await page.waitForSelector('article');
        //

        const items = await page.$$('article');
        //
        for (const item of items) {
            try {
                //
                const link = await page.evaluate(a => a.href, item);
                const headline = await item.$eval('.teaser__title', a => a.textContent);

                add.push({
                    "link": link + "  kokk",
                    "headline": headline.trim()
                })
            } catch (error) {
                console.log(`From ${uri} loop: ${error}`.bgMagenta);
                continue;

            }
        }
        console.log(`Done: ${uri}`.bgYellow)

        browser.close();
    } catch (error) {
        console.log(`From ${uri} Main: ${error}`.bgRed);
    }
}
let source = "https://www.africanews.com/";
main(source);
/////
africa.get('/test', (req, res) => {
    res.send({
        "africa": add
    });
})

module.exports = africa;
const express = require('express');
const blomNews = express.Router();
const puppeteer = require('puppeteer');
require('dotenv').config()
const vars = require('./store/storeVars');
const scrollPageToBottom = require('puppeteer-autoscroll-down');
///
process.setMaxListeners(Infinity);
//
let add = [];

async function main(uri) {

    try {
        const browser = await puppeteer.launch({
            args: vars.argsArr,
            headless: vars.bool,
            defaultViewport: null,
            executablePath: vars.exPath
        });
        const page = await browser.newPage();
        page.setUserAgent(vars.userAgent);
        await page.goto(uri, { waitUntil: 'networkidle2', timeout: 0 });
        await page.waitForSelector('.story-package-module__story.mod-story');
        let myVar = setInterval(() => scrollPageToBottom(page), 100);
        await page.waitFor(12300);
        const items = await page.$$('.story-package-module__story.mod-story');
        //
        for (const item of items) {
            try {
                //
                const get = await item.$('.bb-lazy-img__image');
                const f = await item.$('h3 > a');
                const time = await item.$('time');
                const cat = await item.$('.story-package-module__story__eyebrow');
                //
                const link = await page.evaluate(a => a.href, f);
                const category = (cat != null || undefined) ? await page.evaluate(section => section.textContent, cat).trim() : null;
                const headline = await item.$eval('h3 > a', a => a.innerText);
                const date = (time != null || undefined) ? await page.evaluate(time => time.innerText, time) : null;
                const thumbnail = (get != null || undefined) ? await page.evaluate(img => img.src, get) : null;
                //

                add.push({

                    "date": date,
                    "category": category,
                    "url": link,
                    "thumbnail": thumbnail,
                    "headline": headline,
                })
            } catch (error) {
                console.trace('\x1b[42m%s\x1b[0m', `From ${uri} loop: ${error}`);
                continue;
            }

        }
        //

        console.log('\x1b[43m%s\x1b[0m', `Done: ${uri}`);
        browser.close();
    } catch (error) {
        console.trace('\x1b[41m%s\x1b[0m', `From ${uri} Main: ${error}`);
    }
}
let source = "https://www.bloomberg.com/africa";
main(source);
/////
blomNews.get('/bloomberg', (req, res) => {
    res.send({
        "source": {
            "name": "blomNews",
            "page url": source
        },
        "blomNews": add
    });
})

module.exports = blomNews;
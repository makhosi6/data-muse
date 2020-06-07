const express = require('express');
const mgNews = express.Router();
const puppeteer = require('puppeteer');
require('dotenv').config();
const vars = require('./store/storeVars');
///
process.setMaxListeners(Infinity);
//
let add = [];

async function main(uri) {

    try {
        const browser = await puppeteer.launch({
            args: vars.argsArr,
            defaultViewport: null,
            headless: vars.bool,
            executablePath: vars.exPath
        });
        const page = await browser.newPage();
        page.setUserAgent(vars.userAgent);

        await page.goto(uri, { waitUntil: 'networkidle2', timeout: 0 });

        await page.waitForSelector('.td_module_flex');
        //
        const items = await page.$$('.td_module_flex');
        await page.waitFor(125000);
        //
        for (const item of items) {
            try {
                // const left = await item.$('.right > .content > .article-synopsis.d-none.d-md-block');
                const get = await item.$('.td-image-wrap');
                const e = await item.$('.td-image-wrap > span');
                const f = await item.$('h3 > a');
                const time = await item.$('time');
                const cred = await item.$('.td-post-author-name > a');
                const para = await item.$('.td-excerpt');
                const cat = await item.$('.td-post-category');
                //
                const thumbnail = await page.evaluate(a => a.style.backgroundImage, e);
                const author = (cred != null || undefined) ? await page.evaluate(a => a.innerText, cred) : null;
                const date = (time != null || undefined) ? await page.evaluate(time => time.innerText, time) : null;
                const link = await page.evaluate(a => a.href, get);
                const headline = await item.$eval('h3 > a', span => span.innerText);
                const lede = (para != null || undefined) ? await item.$eval('.td-excerpt', div => div.innerText) : null;
                const category = (cat != null || undefined) ? await item.$eval('.td-post-category', a => a.innerText) : null;
                //
                let a = thumbnail.split('url("');
                let b = a[1];
                let c = b.split('")');
                let d = c[0];

                const iHtml = await page.evaluate(el => el.innerHTML, item);

                add.push({
                    "author": author,
                    "date": date,
                    "lede": lede,
                    "category": category,
                    "url": link,
                    "thumbnail": d,
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
let source = "https://mg.co.za/";
main(source)
    /////
mgNews.get('/mg/news', (req, res) => {
    res.send({
        "source": {
            "name": "mgNews",
            "page url": source
        },
        "mgNews": add
    });
})

module.exports = mgNews;
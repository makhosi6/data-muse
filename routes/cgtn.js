const express = require('express');
const cgtnNews = express.Router();
const browser = require('../browser');
require('dotenv').config()
const vars = require('./store/storeVars');
///
process.setMaxListeners(Infinity);
//
let add_cgtn = [];

async function main(uri_cgtn) {
    try {
        const page_cgtn = await browser.newPage();
        page_cgtn.setUserAgent(vars.userAgent);
        await page_cgtn.goto(uri_cgtn, { waitUntil: 'networkidle2', timeout: 0 });
        await page_cgtn.waitForSelector('.cg-newsWrapper');
        await page_cgtn.waitFor(12300);
        const items_cgtn = await page_cgtn.$$('.cg-newsWrapper');
        for (const item of items_cgtn) {
            try {
                //
                const image = await item.$('.cg-pic > a > img');
                const hed = await item.$('h4 > a');
                const time = await item.$('.cg-time');
                const cat = await item.$('.cg-newsCategory');
                const para = await item.$('.cg-content');
                //
                const link = await page_cgtn.evaluate(a => a.href, hed);
                const category = (cat != null || undefined) ? await page_cgtn.evaluate(section => section.textContent, cat) : null;
                const headline = await item.$eval('h4 > a', a => a.innerText);
                const date = (time != null || undefined) ? await page_cgtn.evaluate(time => time.innerText, time) : null;
                const lede = (para != null || undefined) ? await page_cgtn.evaluate(div => div.innerText, para) : null;
                const thumbnail = (image != null || undefined) ? await page_cgtn.evaluate(img => img.src, image) : null;
                //
                let a = (date != null) ? date.trim() : date;
                let b = (category != null) ? category.trim() : category;
                let c = (headline != null) ? headline.trim() : headline;
                //
                add_cgtn.push({
                    "lede": lede,
                    "date": a,
                    "category": b,
                    "url": link,
                    "thumbnail": thumbnail,
                    "headline": c,
                })
            } catch (error) {
                console.trace('\x1b[42m%s\x1b[0m', `From ${uri_cgtn} loop: ${error}`);
                continue;
            }

        }
        //

        console.log('\x1b[43m%s\x1b[0m', `Done: ${uri_cgtn}`);

    } catch (error) {
        console.trace('\x1b[41m%s\x1b[0m', `From ${uri_cgtn} Main: ${error}`);
    }
}
let source_cgtn = "https://www.cgtn.com/";
main(source_cgtn);
/////
cgtnNews.get('/cgtn', (req, res) => {
    res.send({

        "cgtnNews": add_cgtn
    });
})

module.exports = cgtnNews;
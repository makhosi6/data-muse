const cron = require("node-cron");
require('dotenv').config();
const wsChromeEndpointurl = require('../browser');
const puppeteer = require('puppeteer');
const vars = require('../store/storeVars');
const express = require("express");
const Routa = express.Router();
///
process.setMaxListeners(Infinity);
//
let news = [];
let src_name = "CGTN";
async function main(uri_cgtn) {
    try {
        const browser = await puppeteer.connect({
            browserWSEndpoint: wsChromeEndpointurl,
            defaultViewport: null
        });
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
                const url = await page_cgtn.evaluate(a => a.href, hed);
                const categoryA = (cat != null || undefined) ? await page_cgtn.evaluate(section => section.textContent, cat) : null;
                const headlineA = await item.$eval('h4 > a', a => a.innerText);
                const dateA = (time != null || undefined) ? await page_cgtn.evaluate(time => time.innerText, time) : null;
                const lede = (para != null || undefined) ? await page_cgtn.evaluate(div => div.innerText, para) : null;
                const thumbnail = (image != null || undefined) ? await page_cgtn.evaluate(img => img.src, image) : null;
                //
                let date = (dateA != null) ? dateA.trim() : dateA;
                let category = (categoryA != null) ? categoryA.trim() : categoryA;
                let headline = (headlineA != null) ? headlineA.trim() : headlineA;
                //
                let empty = null;
                let emptyArr = [];
                //
                let catLink = empty;
                let author = empty;
                let tag = empty;
                let vidLen = empty;
                let url_src = uri_cgtn;
                let isVid = false;
                let images = emptyArr;
                let src = "https://ui.cgtn.com/static/ng/resource/images/icon/logo@3x.png";

                //
                news.push({
                    url_src,
                    src_name,
                    //
                    url,
                    headline,
                    lede,
                    thumbnail,
                    src,
                    //
                    category,
                    catLink,
                    tag,
                    //
                    images,
                    //
                    isVid,
                    vidLen,
                    //
                    author,
                    date
                })
            } catch (error) {
                console.log('\x1b[42m%s\x1b[0m', `From ${uri_cgtn} loop: ${error.name}`)
                continue;
            }
        }
        //
        await page_cgtn.close();
        console.log('\x1b[43m%s\x1b[0m', `Done: ${uri_cgtn}`);

    } catch (error) {
        console.log('\x1b[41m%s\x1b[0m', `From ${uri_cgtn} Main: ${error}`);
    }
}
let source_cgtn = "https://www.cgtn.com/";

// cron.schedule("0 3 * * *", () => {

        console.log('\x1b[46m%s\x1b[0m', "CGTN fired at:" + Date());
     main(source_cgtn);
// });

/////
Routa.get('/cgtn', (req, res) => {
    res.send({
        news
    });
});
module.exports = Routa;
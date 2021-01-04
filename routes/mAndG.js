const cron = require("node-cron");
// const wsChromeEndpointurl = require('../browser');
const puppeteer = require('puppeteer');
const generateUniqueId = require('generate-unique-id');
require('dotenv').config();
const vars = require('../store/storeVars');
const express = require("express");
const Routa = express.Router();
///

//
let x = "";
let y = "";
let add = [];
let src_name = "M&G";

async function main(uri) {
    try {
        const browser = await puppeteer.launch({

            defaultViewport: null,
            headless: false
        });
        const page = await browser.newPage();
        page.setUserAgent(vars.userAgent);
        await page.goto(uri, {
            waitUntil: 'networkidle2',
            timeout: 0
        });
        await page.waitForSelector('.td_module_flex');
        const items = await page.$$('.td_module_flex');
        await page.waitFor(15000);
        //
        for (const item of items) {
            try {
                // const left = await item.$('.right > .content > .article-synopsis.d-none.d-md-block');
                const get = await item.$('.td-image-wrap');
                const e = await item.$('.td-image-wrap > span');
                x = await page.evaluate(el => el.innerHTML, item);
                const f = await item.$('h3 > a');
                const time = await item.$('time');
                const cred = await item.$('.td-post-author-name > a');
                const para = await item.$('.td-excerpt');
                const cat = await item.$('.td-post-category');
                //
                const thumb = await page.evaluate(a => a.style.backgroundImage, e) || await item.$eval('.td-image-wrap > span', img => img.dataset.bg);
                let a;
                let b;
                let c;
                let thumbnail;
                if(thumb.includes('url("')){
                  
                    a = (thumb !== null  || thumb !== undefined) ? thumb.split('url("') : null;
                    b = a[1];
                    c = (thumb !== null || thumb !== undefined) ? b.split('")') : null;
                    thumbnail = (thumb !== null) ? c[0] : null;
                } else{
                    thumbnail = thumb;
                }
                
                const author = (cred != null || undefined) ? await page.evaluate(a => a.innerText, cred) : null;
                const date = (time != null || undefined) ? await page.evaluate(time => time.innerText, time) : null;
                const url = await page.evaluate(a => a.href, get);
                const headline = await item.$eval('h3 > a', span => span.innerText);
                const lede = (para != null || undefined) ? await item.$eval('.td-excerpt', div => div.innerText) : null;
                const tag = (cat != null || undefined) ? await item.$eval('.td-post-category', a => a.innerText) : null;
                //
                let src_logo = "https://bucket.mg.co.za/wp-media/2020/01/74e543ae-logo-white-467.png";
              
                let src_url = await page.evaluate(() => location.origin);
                const id = generateUniqueId({
                    length: 32
                });

                let empty = null;

                let catLink = empty;
                let category = "news";
                let images = empty;
                let authors = empty;
                //
                let isVid = false;
                let vidLen = empty;
                //
                let key = empty;
                let tags = empty;
                let label = empty;
                let type = ((thumb !== null) &&(thumb !== undefined)) ? "title-only" : "strip";
                //
                let subject = empty;
                let format = empty;
                let about = empty;

                add.push({
                    id,
                    url,
                    headline,
                    lede,
                    thumbnail,
                    category,
                    catLink,
                    images,
                    //
                    key,
                    label,
                    //
                    subject,
                    format,
                    about,
                    //
                    src_name,
                    src_url,
                    src_logo,
                    //
                    isVid,
                    vidLen,
                    //
                    type,
                    tag,
                    tags,
                    //
                    author,
                    authors,
                    date
                })
            } catch (error) {
                console.log('\x1b[42m%s\x1b[0m', `From ${uri} loop: ${error}`);
                continue;
            }
        }
        //
        await page.close();
        console.log('\x1b[43m%s\x1b[0m', `Done: ${uri}`);
    } catch (error) {
        console.log('\x1b[41m%s\x1b[0m', `From ${uri} Main: ${error}`);
    }
}
let source = "https://mg.co.za/";


// cron.schedule("0 4 * * SUN", () => {
console.log('\x1b[46m%s\x1b[0m', "M&G fired at:" + Date());
main(source);
// });
//
Routa.get('/mg/news', (req, res) => {
    res.send({
        "lifestyle": add
    });
});
module.exports = Routa;
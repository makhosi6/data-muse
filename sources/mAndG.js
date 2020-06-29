const cron = require("node-cron");
const wsChromeEndpointurl = require('../browser');
const puppeteer = require('puppeteer');
require('dotenv').config();
const vars = require('../store/storeVars');
///
process.setMaxListeners(Infinity);
//
let add = [];
let src_name = "mg";

async function main(uri) {
    try {
        let url_src = uri;
        const browser = await puppeteer.connect({
            browserWSEndpoint: wsChromeEndpointurl,
            defaultViewport: null
        });
        const page = await browser.newPage();
        page.setUserAgent(vars.userAgent);
        await page.goto(uri, { waitUntil: 'networkidle2', timeout: 0 });
        await page.waitForSelector('.td_module_flex');
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
                const thumb = await page.evaluate(a => a.style.backgroundImage, e);
                const author = (cred != null || undefined) ? await page.evaluate(a => a.innerText, cred) : null;
                const date = (time != null || undefined) ? await page.evaluate(time => time.innerText, time) : null;
                const url = await page.evaluate(a => a.href, get);
                const headline = await item.$eval('h3 > a', span => span.innerText);
                const lede = (para != null || undefined) ? await item.$eval('.td-excerpt', div => div.innerText) : null;
                const category = (cat != null || undefined) ? await item.$eval('.td-post-category', a => a.innerText) : null;
                //
                let a = thumb.split('url("');
                let b = a[1];
                let c = b.split('")');
                let thumbnail = c[0];
                let src = "https://bucket.mg.co.za/wp-media/2020/01/74e543ae-logo-white-467.png";
                const iHtml = await page.evaluate(el => el.innerHTML, item);
                let empty = null;
                let emptyArr = "";
                let catLink = empty;
                let tag = category;
                let images = emptyArr;
                //
                let isVid = false;
                let vidLen = empty;

                add.push({
                    url_src,
                    url,
                    src_name,
                    headline,
                    lede,
                    thumbnail,
                    //
                    src,
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
                console.log('\x1b[42m%s\x1b[0m', `From ${uri} loop: ${error.name}`)
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


cron.schedule("0 4 * * SUN", () => {
    (() => {
        console.log('\x1b[46m%s\x1b[0m', "M&G fired at:" + Date());
        //
        main(source);

    })();
});
/////

module.exports = {
    "lifestyle": add
};
const cron = require("node-cron");
const puppeteer = require("puppeteer");
require('dotenv').config();
const wsChromeEndpointurl = require('../browser');
const vars = require('./store/storeVars');
///
process.setMaxListeners(Infinity);
//
let news = [];
let trending = [];
async function main(uri) {
    try {

        const browser = await puppeteer.connect({
            browserWSEndpoint: wsChromeEndpointurl,
        });
        const page = await browser.newPage();
        page.setUserAgent(vars.userAgent);
        await page.goto(uri, { waitUntil: 'networkidle2', timeout: 0 });
        await page.waitFor(125000);
        await page.waitForSelector('article');
        const emAll = await page.$$('article.just-in__article');

        for (const each of emAll) {
            try {
                const time = await each.$('time');
                const ab = await each.$('a');
                const date = (time != null || undefined) ? await page.evaluate(i => i.textContent, time) : null;
                //
                const headline = await each.$eval('h3 > a', a => a.innerText);
                //
                const link = await page.evaluate(a => a.href, ab);
                trending.push({
                    "date": date.replace(/(\r\n|\n|\r)/gm, "").trim(),
                    "url": link,
                    "headline": headline.replace(/(\r\n|\n|\r)/gm, "").trim(),
                })
            } catch (error) {
                console.log('\x1b[42m%s\x1b[0m', `From ${uri} loop: ${error.name}`)

            }
        }


        //
        const items = await page.$$('article');
        //

        for (const item of items) {
            try {
                //
                const timeStamp = await item.$('.boxPlay--duration');
                const e = await item.$('img');
                const f = await item.$('.teaser__title');
                const time = await item.$('time');
                //
                const url = await page.evaluate(a => a.href, item);
                const head = await item.$eval('.teaser__title', a => a.textContent);
                const date = (time != null || undefined) ? await page.evaluate(i => i.textContent, time).trim() : null;
                const thumbnail = (e != null || undefined) ? await item.$eval('img', img => img.src) : null;
                const vidLen = (timeStamp != null || undefined) ? await page.evaluate(a => a.innerText, timeStamp) : null;
                const isVid = (timeStamp != null || undefined) ? true : false;
                //
                let headline = head.trim();
                const iHtml = await page.evaluate(el => el.innerHTML, item);
                let empty = null;
                let emptyArr = "";
                let src = "https://www.screenafrica.com/wp-content/uploads/2018/04/Africanews-logo.png";
                let lede = empty;
                let author = empty;
                let tag = empty;
                let category = empty;
                let catLink = empty;
                let images = emptyArr;

                news.push({
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
let source = "https://www.africanews.com/";



cron.schedule("0 */6 * * *", () => {

    (() => {
        console.log('\x1b[46m%s\x1b[0m', "Africa fired at:" + Date());

        main(source);

    })();
});
/////

module.exports = {
    news,
    trending
};
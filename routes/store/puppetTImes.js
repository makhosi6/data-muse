const vars = require('./storeVars');
const puppeteer = require('puppeteer');
const wsChromeEndpointurl = require('../../browser');
//
class Scrapper {
    constructor(uri) {
        this.uri = uri;
        this.data = [];
        this.puppet = async function() {
            try {

                const browser = await puppeteer.connect({
                    browserWSEndpoint: wsChromeEndpointurl,
                    defaultViewport: null
                });
                const page = await browser.newPage();
                page.setUserAgent(vars.userAgent);
                await page.goto(this.uri, { waitUntil: 'networkidle2', timeout: 0 });
                await page.waitForSelector('.article');
                const items = await page.$$('.generic-block');
                await page.waitFor(125000);
                //
                let arrr = [];
                //
                for (const item of items) {
                    try {

                        const get = await item.$('a.image.image-loader');
                        const e = await item.$('span.image-loader-image');
                        const f = await item.$('.article-text');
                        //
                        const thumbnail = await page.evaluate(a => a.style.backgroundImage, e);

                        const link = await page.evaluate(a => a.href, get);
                        const headline = await item.$eval('.article-title', span => span.innerText);
                        const lede = (f != null || undefined) ? await item.$eval('.article-text', a => a.innerText) : null;
                        const category = await item.$eval('span.section-title', span => span.innerText);
                        //
                        let a = thumbnail.split('url("');
                        let b = a[1];
                        let c = b.split('")');
                        let d = c[0];

                        const iHtml = await page.evaluate(el => el.innerHTML, item);


                        arrr.push({

                            "lede": lede,
                            "category": category,
                            "url": link,
                            "thumbnail": d,
                            "headline": headline,
                        })
                    } catch (error) {
                        console.trace('\x1b[42m%s\x1b[0m', `From ${this.uri} loop: ${error}`);
                        continue;

                    }
                }
                this.data = arrr;
                await page.close()
                console.log('\x1b[43m%s\x1b[0m', `Done: ${this.uri}`);

            } catch (error) {
                console.trace('\x1b[41m%s\x1b[0m', `From ${this.uri} Main: ${error}`);
            }

            return this.data;
        }
    }
}

module.exports = {
    Scrapper: Scrapper
};
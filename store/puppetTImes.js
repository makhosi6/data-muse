const vars = require('./storeVars');
const puppeteer = require('puppeteer');
const wsChromeEndpointurl = require('../browser');
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
                        const img = await page.evaluate(a => a.style.backgroundImage, e);

                        const url = await page.evaluate(a => a.href, get);
                        const headline = await item.$eval('.article-title', span => span.innerText);
                        const lede = (f != null || undefined) ? await item.$eval('.article-text', a => a.innerText) : null;
                        const category = await item.$eval('span.section-title', span => span.innerText);
                        //
                        let a = img.split('url("');
                        let b = a[1];
                        let c = b.split('")');
                        let thumbnail = c[0];

                        const iHtml = await page.evaluate(el => el.innerHTML, item);
                        let src = "https://www.timeslive.co.za/publication/custom/static/logos/timeslive.logo.png";
                        //

                        let emptyArr = "";
                        //
                        let images = emptyArr;
                        let tag = category;
                        let catLink = null;
                        let isVid = true;
                        let vidLen = catLink;
                        let author = catLink;
                        let date = catLink;
                        //
                        arrr.push({
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
                        console.log('\x1b[42m%s\x1b[0m', `From ${this.uri} loop: ${error.name}`)
                        continue;

                    }
                }
                this.data = arrr;
                await page.close()
                console.log('\x1b[43m%s\x1b[0m', `Done: ${this.uri}`);

            } catch (error) {
                console.log('\x1b[41m%s\x1b[0m', `From ${this.uri} Main: ${error}`);
            }

            return this.data;
        }
    }
}

module.exports = {
    Scrapper: Scrapper
};
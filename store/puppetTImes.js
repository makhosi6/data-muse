const vars = require('./storeVars');
const puppeteer = require('puppeteer');
// const wsChromeEndpointurl = require('../browser');

//
let src_name = "Timeslive";
//
class Scrapper {
    constructor(uri) {
        this.uri = uri;
        this.data = [];
        this.puppet = async function() {
            try {
                const browser = await puppeteer.launch({
                    defaultViewport: null,
                    headless: false
                 });
                const page = await browser.newPage();
                page.setUserAgent(vars.userAgent);
                await page.goto(this.uri, { waitUntil: 'networkidle2', timeout: 0 });
                await page.waitForSelector('.link');
                const items = await page.$$('.link');
                await page.waitFor(30000);
                //
                console.log('0ne')
                let arrr = [];
                //
                for (const item of items) {
                    try {
                        console.log('top')
                        const get = await item.$('a');
                        // const e = await item.$('span.image-loader-image');
                        const f = await item.$('.article-text');
                        //
                        console.log('first')
                        // const img = await page.evaluate(a => a.style.backgroundImage, e);

                        const url = await page.evaluate(a => a.href, get);
                        const headline = await item.$eval('.article-title', span => span.innerText);
                        const lede = (f != null || undefined) ? await item.$eval('.article-text', a => a.innerText) : null;
                        const category = await item.$eval('span.section-title', span => span.innerText);
                        //
                        // let a = img.split('url("');
                        // let b = a[1];
                        // let c = b.split('")');
                        // let url_src = this.uri;
                        // let thumbnail = c[0];
                        console.log('eight');
                        //
                        const iHtml = await page.evaluate(el => el.innerHTML, item);
                        let src_logo = "https://www.timeslive.co.za/publication/custom/static/logos/timeslive.logo.png";
                        //
                        let images = empty;
                        let tag = category;
                        let catLink = null;
                        let isVid = true;
                        let vidLen = catLink;
                        let author = catLink;
                        let date = catLink;
                        console.log('nina');
                        //
                        arrr.push({
                            url_src,
                            src_name,
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
                        console.log({thumbnail});
                    } catch (error) {
                        console.log('\x1b[42m%s\x1b[0m', `From ${this.uri} loop: ${error}`)
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
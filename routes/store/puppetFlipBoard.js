const vars = require('./storeVars');
const puppeteer = require("puppeteer");
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
                await page.waitForSelector('.item-list');
                const items = await page.$$('.post__section-item-display');
                let arrr = [];
                //
                for (let i = 0; i < items.length; i++) {
                    try {
                        await page.goto(this.uri, { waitUntil: 'networkidle2', timeout: 0 });
                        await page.waitForSelector('.item-list');
                        const items = await page.$$('.post__section-item-display');
                        const item = items[i];
                        const title = await item.$('.post__title');
                        // 
                        const para = await item.$('.post__excerpt');
                        const thumbnail = await item.$eval('img', img => img.src);
                        const src = await item.$eval('.author-avatar__image.image.image--loaded', img => img.src);
                        const headline = await title.$eval('a.internal-link', a => a.innerText);
                        const tagEl = await item.$('a.topic-tag');
                        const tag = (tagEl != null || undefined) ? await item.$eval('a.topic-tag', a => a.innerText) : null;
                        const cred = await item.$('.post-attribution__source');
                        const source = (cred != null || undefined) ? await cred.$eval('a', a => a.innerText) : null;
                        const lede = await para.$eval('a', a => a.innerText);
                        const date = await item.$eval('time', time => time.innerText);
                        //
                        const author = source.replace(" and ", " & ");
                        const windo = await item.$('.post__title > a');
                        windo.click();
                        await page.waitFor(33000);
                        await page.waitForSelector('.post__read-more');
                        let button = await page.$x('//*[@id="content"]/div/main/div/div/div[1]/div/div[2]');
                        let ellen = await page.waitForSelector('.post__read-more');
                        const url_raw = (button != null || undefined) ? await ellen.$eval('a', a => a.href) : null;
                        const a = url_raw.split("url=");
                        const b = a[1];
                        const c = b.split("&v=");
                        const d = c[0];
                        const url = decodeURIComponent(d);

                        let empty = null;
                        let emptyArr = "";
                        //
                        let images = emptyArr;
                        let catLink = empty;
                        let vidLen = empty;
                        let isVid = false;

                        arrr.push({
                            url,
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
                        });

                    } catch (error) {
                        console.log('\x1b[42m%s\x1b[0m', `From ${this.uri} loop: ${error.name}`)
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
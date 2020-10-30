const vars = require('./storeVars');
const puppeteer = require("puppeteer");
const wsChromeEndpointurl = require('../browser');
//
let src_name = "EWN";
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
                await page.waitForSelector('.article-short');
                const items = await page.$$('.article-short');
                await page.waitFor(5000);
                let arrr = [];
                for (const item of items) {
                    try {
                        const check = await item.$('.thumb');
                        const left = await item.$('.left');
                        if ((check == null) && (left == null)) {

                            const headline = await item.$('h4');
                            const image = await item.$('img');
                            const thumbnail = (image != null || undefined) ? await item.$eval('img', img => img.src) : null;
                            const url = await headline.$eval('a', a => a.href);
                            //
                            const headlineText = await headline.$eval('a', a => a.innerText);
                            //
                            const para = await item.$('p.lead');
                            const lede = (para != null || undefined) ? await item.$eval('p', p => p.innerText) : null;
                            const date = await item.$eval('abbr', abbr => abbr.innerText);
                            let src = "https://ewn.co.za/site/design/img/ewn-logo.png";


                            let empty = null;
                            let emptyArr = [];
                            //
                            let images = emptyArr;
                            let tag = empty;
                            let catLink = empty;
                            let url_src = this.uri;
                            let author = empty;
                            let vidLen = empty;
                            let isVid = false;
                            arrr.push({
                                url_src,
                                src_name,
                                vidLen,
                                isVid,
                                author,
                                catLink,
                                tag,
                                images,
                                src,
                               url,
                             lede,
                                "headline": headlineText,
                               thumbnail,
                               date
                            })
                        }

                    } catch (error) {
                        console.log('\x1b[42m%s\x1b[0m', `From ${this.uri} loop: ${error.name}`)
                        continue;
                    }

                }
                //
                this.data = arrr;
                await page.close()
                console.log('\x1b[43m%s\x1b[0m', `Done: ${this.uri}`);

            } catch (error) {
                console.log('\x1b[41m%s\x1b[0m', `From ${this.uri} Main: ${error}`);
            }

            return this.data
        }
    }
}

module.exports = {
    Scrapper: Scrapper
};
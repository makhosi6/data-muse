const vars = require('./storeVars');
const puppeteer = require('puppeteer');
// const wsChromeEndpointurl = require('../browser');
//
let src_name = "BBC";
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
                await page.waitFor(15000);
                await page.waitForSelector('.gs-c-promo');
                const items = await page.$$('.gs-c-promo');
                await page.waitFor(5000);
                //
                let arrr = [];
                //
                for (const item of items) {
                    try {
                        const body = item;
                        const media = await item.$('.gs-c-promo-image');
                        const para = await item.$('.gs-c-promo-summary');
                        const el = await body.$('.nw-c-promo-meta');
                        const cont = await body.$('.qa-time');
                        const sect = (body != null || undefined) ? await body.$('.gs-c-section-link') : null;
                        //
                        const mediaLink = (media != null || undefined) ? await media.$eval('img', img => img.src) : null;
                        const value = (mediaLink != null || undefined) ? await item.$eval('img', img => img.dataset.src) : null;
                        const images = (mediaLink != null || undefined) ? await item.$eval('img', img => img.srcset) : null;
                        const url = (body != null || undefined) ? await body.$eval('a', a => a.href) : null;
                        const headline = (body != null || undefined) ? await body.$eval('h3', h3 => h3.innerText) : null;
                        const date = (el != null || undefined) ? await body.$eval('span.qa-status-date-output', span => span.innerText) : null;
                        const vidLen = (cont != null) ? await body.$eval('span.qa-onscreen', span => span.innerText) : null;
                        const isVid = (vidLen != null || undefined) ? true : false;
                        const cat = (el != null || undefined) ? await sect.$eval('span', span => span.innerText) : null;
                        const catLink = (el != null || undefined) ? await sect.$eval('span', span => span.href) : null;
                        const lede = ((para != null || undefined) && (media != null || undefined)) ? await body.$eval('p', p => p.innerText) : null;
                        //
                        let slc = url.slice(21, 31)
                        const category = (slc == "programmes") ? "programmes" : cat;
                        let thumbnail = (value != null) ? value.replace("{width}", "490") : null;
                        //
                        let empty = null;
                        
                        //
                        let src = "https://nav.files.bbci.co.uk/orbit/db9d3ece642dbb01f23f791064ec1502/img/blq-orbit-blocks_grey_alpha.png";
                        let tag = category;
                        let author = empty;
                        let url_src = this.uri;
                        //
                        arrr.push({
                            src_name,
                            url_src,
                            url,
                            src,
                            headline,
                            lede,
                            thumbnail,
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
                        console.log('\x1b[42m%s\x1b[0m', `From ${this.uri} loop: ${error}`)
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
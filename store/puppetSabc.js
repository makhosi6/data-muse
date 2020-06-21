const puppeteer = require("puppeteer");
const wsChromeEndpointurl = require('../browser');
const vars = require('./storeVars');
//
class Scrapper {
    constructor(uri, cat) {
        this.uri = uri;
        this.cat = cat;
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
                await page.waitForSelector('.sabc_cat_list_item');
                const items = await page.$$('.sabc_cat_list_item');
                await page.waitFor(125000);
                let arrr = [];
                //
                for (const item of items) {
                    try {
                        const image = await item.$('.sabc_cat_list_item_image > img');
                        const title = await item.$('.sabc_cat_list_item_title > a');

                        //sabc_cat_item_date
                        const thumbnail = await page.evaluate(img => img.src, image);
                        const date = await item.$eval('.sabc_cat_item_date', span => span.innerText);
                        const lede = await item.$eval('.sabc_cat_list_item_summary', p => p.innerText);
                        const url = await page.evaluate(a => a.href, title);
                        const headline = await page.evaluate(a => a.innerText, title);
                        //
                        const iHtml = await page.evaluate(el => el.innerHTML, item);
                        let category = this.cat;
                        let emptyArr = "";
                        //
                        let src = "https://www.sabcnews.com/sabcnews/wp-content/uploads/2018/06/sabc-logo-white-final.png";
                        let images = emptyArr;
                        let tag = category;
                        let catLink = null;
                        let isVid = true;
                        let vidLen = catLink;
                        let author = catLink;
                        arrr.push({
                            url,
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
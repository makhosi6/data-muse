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
                await page.goto(uri, { waitUntil: 'networkidle2', timeout: 0 });
                await page.waitForSelector('.card-component ul');
                const items = await page.$$('.card-component ul');
                await page.waitFor(5000);
                //
                let arrr = [];
                for (const item of items) {
                    try {
                        const thumbnail = await item.$eval('img', img => img.src);
                        const link = await item.$eval('a', a => a.href);
                        const headline = await item.$eval('h2', h2 => h2.innerText);
                        const author = await item.$eval('a.byline-component__link', a => a.innerText);
                        const category = await item.$eval('span.brow-component--micro', span => span.innerText);
                        arrr.push({
                            "category": category,
                            "url": link,
                            "thumbnail": thumbnail,
                            "headline": headline,
                            "author": author
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
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
                await page.waitForSelector('#btn_showmore_b1_418');
                await page.waitFor(9000);
                await page.click('#btn_showmore_b1_418');
                await page.waitForSelector('#btn_showmore_b1_418');
                await page.waitFor(9000);
                await page.click('#btn_showmore_b1_418');
                await page.waitForSelector('#btn_showmore_b1_418');
                await page.waitFor(9000);
                const items = await page.$$('.topics-sec-item');
                await page.waitFor(5000);
                let arrr = [];
                //
                for (const item of items) {
                    //
                    try {
                        let media = await item.$('div.col-sm-5.topics-sec-item-img > a:nth-child(2)');
                        const thumbnail = (media != null || undefined) ? await media.$eval('img', img => img.dataset.src) : null;
                        const headline = await item.$eval('h2', h2 => h2.innerText);
                        const topic = await item.$eval('a.topics-sec-item-label', a => a.innerText);
                        const date = await item.$eval('time#PubTime', time => time.innerText);
                        const lede = await item.$eval('p.topics-sec-item-p', p => p.innerText);
                        const time = await item.$('.cardsvideoduration');
                        const timeStamp = (time != null || undefined) ? await item.$eval("div.cardsvideoduration", div => div.innerText) : null;

                        let isVid = (timeStamp !== null) ? true : false;
                        let url = await item.$eval('a', a => a.href);
                        ///////

                        arrr.push({
                            "url": url,
                            "lede": lede,
                            "headline": headline,
                            "thumbnail": "https://www.aljazeera.com" + thumbnail,
                            "category": topic,
                            "isVid": isVid,
                            "time stamp": timeStamp,
                            "date": date,
                        })
                    } catch (error) {
                        console.trace('\x1b[42m%s\x1b[0m', `From ${this.uri} loop: ${error}`);
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
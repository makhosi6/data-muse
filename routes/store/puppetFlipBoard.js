const vars = require('./storeVars');
const browser = require('../../browser');
//
class Scrapper {
    constructor(uri) {
        this.uri = uri;
        this.data = [];
        this.puppet = async function() {
            try {
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
                        console.trace('\x1b[36m%s\x1b[0m', this.uri + " => " + __filename)
                        await page.waitForSelector('.item-list');
                        const items = await page.$$('.post__section-item-display');
                        const item = items[i];
                        const title = await item.$('.post__title');
                        // 
                        const para = await item.$('.post__excerpt');
                        const mediaLink = await item.$eval('img', img => img.src);
                        const headlineText = await title.$eval('a.internal-link', a => a.innerText);
                        const tagEl = await item.$('a.topic-tag');
                        const tag = (tagEl != null || undefined) ? await item.$eval('a.topic-tag', a => a.innerText) : null;
                        const cred = await item.$('.post-attribution__source');
                        const source = (cred != null || undefined) ? await cred.$eval('a', a => a.innerText) : null;
                        const lede = await para.$eval('a', a => a.innerText);
                        const timeStamp = await item.$eval('time', time => time.innerText);
                        //
                        const publisher = source.replace(" and ", " & ");
                        const windo = await item.$('.post__title > a');
                        windo.click();
                        await page.waitFor(33000);
                        await page.waitForSelector('.post__read-more');
                        let button = await page.$x('//*[@id="content"]/div/main/div/div/div[1]/div/div[2]');
                        let ellen = await page.waitForSelector('.post__read-more');
                        const url = (button != null || undefined) ? await ellen.$eval('a', a => a.href) : null;
                        const a = url.split("url=");
                        const b = a[1];
                        const c = b.split("&v=");
                        const d = c[0];
                        const e = decodeURIComponent(d);

                        arrr.push({
                            "url": e,
                            "media_link": mediaLink,
                            "headline": headlineText,
                            "tag": tag,
                            "source": publisher,
                            "lede": lede,
                            "time_stamp": timeStamp
                        });

                    } catch (error) {
                        console.trace('\x1b[42m%s\x1b[0m', `From ${this.uri} loop: ${error}`);
                    }
                }
                this.data = arrr;
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
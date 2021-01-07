const vars = require('./storeVars');
const puppeteer = require("puppeteer");
const generateUniqueId = require('generate-unique-id');
// const wsChromeEndpointurl = require('../browser');
//

//
class Scrapper {
    constructor(uri, cat) {
        this.uri = uri;
        this.cat = cat;
        this.data = [];
        this.puppet = async function() {
            try {
                const browser = await puppeteer.launch({
                     defaultViewport: null,
                     headless: false
                });
                const page = await browser.newPage();
                await page.setViewport({
                    width: 1920,
                    height: 968
                });
           
                page.setUserAgent(vars.userAgent);
                await page.goto(this.uri, { waitUntil: 'networkidle2', timeout: 0 });
                await page.waitForSelector('.item-list');
                const items = await page.$$('.post__section-item-display');
                let arrr = [];
                //
                for (let i = 0; i < items.length; i++) {
                    try {
                        console.log("-----------------FIRST------------------------");
                        const empty = null;
                        await page.goto(this.uri, { waitUntil: 'networkidle2', timeout: 0 });
                        await page.waitForSelector('.item-list');
                        const items = await page.$$('.post__section-item-display');
                        const item = items[i];
                        const title = await item.$('.post__title');
                        // 
                        const id = generateUniqueId({
                            length: 32
                        });
                        const para = await item.$('.post__excerpt');
                        const thumbnail = await item.$eval('img', img => img.src);
                        console.log({thumbnail});
                        const src_logo = await item.$eval('header .image--loaded', img => img.src);
                        const headline = await title.$eval('a.internal-link', a => a.innerText);
                        const url = await title.$eval('a.internal-link', a => a.href);
                        const tagEl = await item.$('a.topic-tag');
                        const tag = (tagEl != null || undefined) ? await item.$eval('a.topic-tag', a => a.innerText) : null;
                        const cred = await item.$('.post-attribution__source');
                        const source = (cred != null || undefined) ? await cred.$eval('a', a => a.innerText) : null;
                        let src_name = await page.$eval('.post-attribution__author.internal-link', x => x.innerText);
                        const lede = await para.$eval('a', a => a.innerText);
                        const date = await item.$eval('time', time => time.innerText);
                        //
                        const author = source.replace(" and ", " & ");
                        const next = await item.$('.post__title > a');
                        next.click();
                        await page.waitFor(3000);
                        await page.waitForSelector('.post__read-more');
                        let button = await page.$x('//*[@id="content"]/div/main/div/div/div[1]/div/div[2]');
                        console.log({author});
                        let ellen = await page.waitForSelector('.post__read-more');
                        const src_url = (button != null || undefined) ? await ellen.$eval('a', a => a.href) : null;
                        //
                        let type = "card";
                        let category = this.cat;
                        let key = empty;
                        let label = empty;
                        //
                        let subject = empty;
                        let format = empty;
                        let about = empty;
                        let tags = empty;
                        // console.log({"raw": url_raw});
                        // const a = url_raw.split("url=");
                        // const b = a[1];
                        // console.log({lede});
                        // const c = b.split("&v=");
                        // const d = c[0];
                        // const url = decodeURIComponent(d);

                        let url_src = this.uri;
                        //
                        let images = empty;
                        let catLink = this.uri;
                        let vidLen = empty;
                        let isVid = false;
                        console.log({
                        
                            url,
                            headline,
                            lede,
                            thumbnail,
                            category,
                            catLink,
                            images,
                            //
                            key,
                            label,
                            //
                            subject,
                            format,
                            about
                        });
                        
                        arrr.push({
                            id,
                            url,
                            headline,
                            lede,
                            thumbnail,
                            category,
                            catLink,
                            images,
                            //
                            key,
                            label,
                            //
                            subject,
                            format,
                            about,
                            //
                            src_name,
                            src_url,
                            src_logo,
                            //
                            isVid,
                            vidLen,
                            //
                            type,
                            tag,
                            tags,
                            //
                            author,
                            authors,
                            date
                        });
                    console.log("-----------------END------------------------");
                    } catch (error) {
                        
                        console.log('\x1b[42m%s\x1b[0m', `From ${this.uri} loop: ${error}`);
                        console.log("-----------------END------------------------");
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
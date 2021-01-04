const vars = require('./storeVars');
const puppeteer = require("puppeteer");
const generateUniqueId = require('generate-unique-id');
// const wsChromeEndpointurl = "ws://127.0.0.1:61959/devtools/browser/2615c84a-4bda-4059-9998-dba89fbde12a";
// const wsChromeEndpointurl = require('../browser');

//
let src_name = "Wired";
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
                        const url = await item.$eval('a', a => a.href);
                        const headline = await item.$eval('h2', h2 => h2.innerText);
                        const author = await item.$eval('a.byline-component__link', a => a.innerText);
                        const tag = await item.$eval('span.brow-component--micro', span => span.innerText);

                        let empty = null;
                        let tags = empty;
                        let authors = empty;
                        let category = this.cat;
                        let lede = empty;
                        let images = empty;
                        let src_url = await page.evaluate(() => location.origin);
                        let date = empty;
                        let isVid = false;
                        let vidLen = empty;
                        let catLink = this.uri;
                        let src_logo = "https://www.wired.com/images/icons/logo-black.svg";
                        //
                        const id = generateUniqueId({
                            length: 32
                          });
                           
                        let key = empty;
                        let label = empty;
                        let type = "title-only"
                        //
                        let subject = empty;
                        let format = empty;
                        let about = empty;

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
                            vidLen ,
                            //
                            type,
                            tag,
                            tags,
                            //
                            author,
                            authors ,
                            date
                        })
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
const express = require('express');
const citizen = express.Router();
require('dotenv').config()
const puppeteer = require('puppeteer');
const vars = require('./store/storeVars')
    ///
process.setMaxListeners(Infinity);
//
let add = [];

async function main(uri) {

    try {
        const browser = await puppeteer.launch({
            args: vars.argsArr,
            defaultViewport: null,
            headless: vars.bool,
            executablePath: vars.exPath
        });

        const page = await browser.newPage();
        page.setUserAgent(vars.userAgent);

        await page.goto(uri, { waitUntil: 'networkidle2', timeout: 0 });


        await page.waitFor(125000);
        await page.waitForSelector('.article');

        const emAll = await page.$$('.lead-story');

        for (const each of emAll) {
            try {
                // const left = await item.$('.right > .content > .article-synopsis.d-none.d-md-block');
                const get = await each.$('.image img');
                const a = await each.$('.image > a');
                //
                const thumbnail = await page.evaluate(a => a.src, get);
                const link = await page.evaluate(a => a.href, a);
                const headline = await each.$eval('h3 > a', span => span.innerText);
                const category = await each.$eval('span.category-link > a', a => a.innerText);
                const lede = await each.$eval('.excerpt', span => span.innerText);
                // const ledeT = await each.$eval('span.js-shave', span => span.innerText);
                // let para = lede + ledeT;
                //

                add.push({
                    "category": category,
                    "thumbnail": thumbnail,
                    "url": link,
                    "headline": headline,
                    "lede": lede
                })
            } catch (error) {
                console.trace('\x1b[42m%s\x1b[0m', `From ${uri} loop: ${error.name}`);

            }
        }

        //
        const items = await page.$$('div.article');
        //

        for (const item of items) {
            try {

                //
                const f = await item.$('a');
                const image = await item.$('.img-responsive');
                const cat = await item.$('.category-link > a');
                //
                const category = await page.evaluate(div => div.innerText, cat);
                const thumbnail = await page.evaluate(img => img.src, image);
                const link = await page.evaluate(a => a.href, cat);
                const headline = await item.$eval('.homelead2-headline-more-stories', a => a.innerText);
                //

                const iHtml = await page.evaluate(el => el.innerHTML, item);

                add.push({
                    "category": category,
                    "thumbnail": thumbnail,
                    "url": link,
                    "headline": headline
                })
            } catch (error) {
                console.trace('\x1b[42m%s\x1b[0m', `From ${uri} loop: ${error.name}`);
                continue;
            }

        }
        //

        console.log('\x1b[43m%s\x1b[0m', `Done: ${uri}`);
        browser.close();
    } catch (error) {
        console.trace('\x1b[41m%s\x1b[0m', `From ${uri} Main: ${error.name}`);
    }
}
let source = "https://citizen.co.za/"
main(source);
/////
citizen.get('/citizen', (req, res) => {
    res.send({
        "source": {
            "name": "citizen",
            "page url": source
        },
        "citizen": add
    });
})

module.exports = citizen
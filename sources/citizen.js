const express = require('express');
const citizen = express.Router();
require('dotenv').config();
const cron = require("node-cron");
const puppeteer = require('puppeteer');
const vars = require('../store/storeVars');
const wsChromeEndpointurl = require('../browser');
const Routa = vars.Routa;
///
process.setMaxListeners(Infinity);
//
let news = [];
let src = "https://citizen.co.za/wp-content/themes/citizen-v5-2/images/citizen_logo_footer_v2.png";
let src_name = "Citizen";


async function main(uri) {

    try {
        let url_src = uri;
        const browser = await puppeteer.connect({
            browserWSEndpoint: wsChromeEndpointurl,
            defaultViewport: null
        });
        const page = await browser.newPage();
        page.setUserAgent(vars.userAgent);
        await page.goto(uri, { waitUntil: 'networkidle2', timeout: 0 });
        await page.waitFor(125000);
        await page.waitForSelector('.article');
        const emAll = await page.$$('.lead-story');
        for (const each of emAll) {
            try {
                const get = await each.$('.image img');
                const a = await each.$('.image > a');
                //
                const thumbnail = await page.evaluate(a => a.src, get);
                const url = await page.evaluate(a => a.href, a);
                const headline = await each.$eval('h3 > a', span => span.innerText);
                const category = await each.$eval('span.category-link > a', a => a.innerText);
                const lede = await each.$eval('.excerpt', span => span.innerText);
                // const ledeT = await each.$eval('span.js-shave', span => span.innerText);
                // let para = lede + ledeT;
                //
                let empty = null;
                let emptyArr = "";

                let catLink = empty;
                let author = empty;
                let date = empty;
                let tag = category;
                let images = emptyArr;
                let vidLen = empty;
                let isVid = false;

                news.push({
                    url_src,
                    src_name,
                    url,
                    headline,
                    lede,
                    thumbnail,
                    src,
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
                console.log('\x1b[42m%s\x1b[0m', `From ${uri} loop: ${error.name}`)
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
                const url = await page.evaluate(a => a.href, cat);
                const headline = await item.$eval('.homelead2-headline-more-stories', a => a.innerText);
                //

                const iHtml = await page.evaluate(el => el.innerHTML, item);

                let empty = null;
                let emptyArr = "";

                let catLink = empty;
                let date = empty;
                let lede = empty;
                let author = empty;
                let images = emptyArr;
                let tag = category;
                let vidLen = empty;
                let isVid = false;

                news.push({
                    url_src,
                    src_name,
                    url,
                    headline,
                    lede,
                    thumbnail,
                    src,
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
                console.log('\x1b[42m%s\x1b[0m', `From ${uri} loop: ${error.name}`)
                continue;
            }
        }
        //
        console.log('\x1b[43m%s\x1b[0m', `Done: ${uri}`);
        await page.close();
    } catch (error) {
        console.log('\x1b[41m%s\x1b[0m', `From ${uri} Main: ${error}`);
    }
}
let source = "https://citizen.co.za/";

cron.schedule("0 3 * * *", () => {

    (() => {
        console.log('\x1b[46m%s\x1b[0m', "CITIZEN fired at:" + Date());

        main(source);
    })();
});
/////
Routa.get('/citizen', (req, res) => {
    res.send({

        news

    });
})
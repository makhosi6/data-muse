const express = require('express');
const international = express.Router();
require('dotenv').config()
const wsChromeEndpointurl = require('../browser');
const puppeteer = require('puppeteer');
const vars = require('./store/storeVars')

///
process.setMaxListeners(Infinity);
//
let add_inter = [];
let add_local = [];
let src = "https://dj0j0ofql4htg.cloudfront.net/assets/dumb/images/soccerladuma-logo.png";

async function main(uri_inter, uri_local) {

    try {
        const browser = await puppeteer.connect({
            browserWSEndpoint: wsChromeEndpointurl,
            defaultViewport: null
        });
        const page_inter = await browser.newPage();
        page_inter.setUserAgent(vars.userAgent);
        await page_inter.goto(uri_inter, { waitUntil: 'networkidle2', timeout: 0 });
        await page_inter.waitForSelector('.pod');
        const items_inter = await page_inter.$$('.pod');
        await page_inter.waitFor(125000);
        //
        for (const item of items_inter) {
            try {
                const get = await item.$('img.story-img');
                const f = await item.$('.pod__meta');
                const thumbnail = await page_inter.evaluate(img => img.dataset.src, get);
                const url = await item.$eval('a', a => a.href);
                const headline = await item.$eval('h2 > a', a => a.innerText);
                const time = await page_inter.evaluate(a => a.innerText, f);
                const iHtml = await page_inter.evaluate(el => el.innerHTML, item);

                let a = (time != null || undefined) ? time.split("\n") : null;
                let date = (a != null) ? a[1].replace(/(\r\n|\n|\r)/gm, "").trim() : null;

                //
                let empty = null;
                let emptyArr = "";
                //
                let lede = empty;
                let category = empty;
                let catLink = empty;
                let tag = empty;
                //
                let images = emptyArr;
                //
                let isVid = false;
                let vidLen = empty;
                //
                let author = empty;
                //
                add_inter.push({
                    url,
                    headline,
                    lede,
                    thumbnail,
                    //
                    src,
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
                console.trace('\x1b[42m%s\x1b[0m', `From ${uri_local} loop: ${error}`);
                continue;

            }
        }
        //

        const page_local = await browser.newPage();
        page_local.setUserAgent(vars.userAgent);
        await page_local.goto(uri_local, { waitUntil: 'networkidle2', timeout: 0 });
        await page_local.waitForSelector('.pod');
        const items_local = await page_local.$$('.pod');
        await page_local.waitFor(125000);
        //
        for (const item of items_local) {
            try {
                // const left = await item.$('.right > .content > .article-synopsis.d-none.d-md-block');
                const get = await item.$('img.story-img');
                const f = await item.$('.pod__meta');
                const thumbnail = await page_local.evaluate(img => img.dataset.src, get);
                const url = await item.$eval('a', a => a.href);
                const headline = await item.$eval('h2 > a', a => a.innerText);
                const time = await page_local.evaluate(a => a.innerText, f);
                const iHtml = await page_local.evaluate(el => el.innerHTML, item);
                let a = (time != null || undefined) ? time.split("\n") : null;
                let date = (a != null) ? a[1].replace(/(\r\n|\n|\r)/gm, "").trim() : null;
                //

                let empty = null;
                let emptyArr = "";
                //
                let lede = empty;
                let category = empty;
                let catLink = empty;
                let tag = empty;
                //
                let images = emptyArr;
                //
                let isVid = false;
                let vidLen = empty;
                //
                let author = empty;
                //
                //
                add_local.push({
                    url,
                    headline,
                    lede,
                    thumbnail,
                    //
                    src,
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
                console.trace('\x1b[42m%s\x1b[0m', `From ${uri_local} loop: ${error}`);
                continue;
            }

        }
        //
        await page_inter.close();
        await page_local.close();
        console.log('\x1b[43m%s\x1b[0m', `Done: ${uri_local}`);

    } catch (error) {
        console.trace('\x1b[41m%s\x1b[0m', `From ${uri_local} Main: ${error}`);
    }
}
let source_inter = "https://www.soccerladuma.co.za/news/articles/international/landing";
let source_local = "https://www.soccerladuma.co.za/news/articles/local/landing";
main(source_inter, source_local);
/////
international.get('/laduma', (req, res) => {
    res.send({

        "international": add_inter,
        "local": add_local
    });
})

module.exports = international;
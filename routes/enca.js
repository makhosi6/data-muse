require('dotenv').config();
const cron = require("node-cron");
const wsChromeEndpointurl = require('../browser');
const puppeteer = require('puppeteer');
const vars = require('../store/storeVars');
const express = require("express");
const Routa = express.Router();
//
process.setMaxListeners(Infinity);
///
let add_sport = [];
let add_video = [];
let add_business = [];
let add_trends = [];
let src = "https://www.enca.com/sites/all/themes/custom/enca/images/eNCA_logo.svg";
let src_name = "enca";

async function main(uri_sport, uri_video, uri_business) {
    try {
        const browser = await puppeteer.connect({
            browserWSEndpoint: wsChromeEndpointurl,
            defaultViewport: null
        });
        const page_sport = await browser.newPage();
        page_sport.setUserAgent(vars.userAgent);
        await page_sport.goto(uri_sport, { waitUntil: 'networkidle2', timeout: 0 });
        await page_sport.waitForSelector('.views-row');
        const items_sport = await page_sport.$$('.views-row');
        await page_sport.waitFor(5000);
        //
        for (const item of items_sport) {
            try {

                const head = await item.$('h2');
                const image = await item.$('img');
                const sec = await item.$('.para-section-author');
                const para = await item.$('.para-section-text');
                //
                const headline = (head != null || undefined) ? await head.$eval('a', a => a.innerText) : null;
                const thumbnail = (image != null || undefined) ? await item.$eval('img', img => img.src) : null;
                const url = (head != null || undefined) ? await head.$eval('a', a => a.href) : null;
                const lede = (para != null || undefined) ? await para.$eval('div.field-content', div => div.innerText) : null;
                const date = (sec != null || undefined) ? await sec.$eval('span.field-content', span => span.innerText) : null;

                let empty = null;
                let emptyArr = [];

                let catLink = empty;
                let author = empty;
                let category = empty;
                let url_src = uri_sport;
                let tag = category;
                let images = emptyArr;
                let vidLen = empty;
                let isVid = false;
                //
                (url === null) ? false: add_sport.push({
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
                });


            } catch (error) {
                console.log('\x1b[42m%s\x1b[0m', `From ${uri_sport} loop: ${error.name}`)
                continue;
            }
        }

        //
        const page_video = await browser.newPage();
        page_video.setUserAgent(vars.userAgent);
        await page_video.goto(uri_video, { waitUntil: 'networkidle2', timeout: 0 });
        await page_video.waitForSelector('.grid__content');
        const items_video = await page_video.$$('.grid__content');
        await page_video.waitFor(5000);
        //

        for (const item of items_video) {
            // 
            try {
                const head = await item.$('h2');
                const image = await item.$('img');

                const para = await item.$('.views-field.views-field-field-teaser-text');
                //
                const headline = (head != null || undefined) ? await head.$eval('a', a => a.innerText) : null;
                const thumbnail = (image != null || undefined) ? await item.$eval('img', img => img.src) : null;
                const url = (head != null || undefined) ? await head.$eval('a', a => a.href) : null;
                const lede = (para != null || undefined) ? await para.$eval('div.field-content', div => div.innerText) : null;


                let empty = null;
                let emptyArr = "";

                let catLink = empty;
                let author = empty;
                let date = empty;
                let category = empty;
                let tag = category;
                let url_src = uri_video;
                let images = emptyArr;
                let vidLen = empty;
                let isVid = false;

                (url === null) ? false: add_video.push({
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

                });


            } catch (error) {
                console.log('\x1b[42m%s\x1b[0m', `From ${uri_video} loop: ${error.name}`)
                continue;
            }
        }
        //
        await page_video.close();

        const page_business = await browser.newPage();
        page_business.setUserAgent(vars.userAgent);
        await page_business.goto(uri_business, { waitUntil: 'networkidle2', timeout: 0 });
        await page_business.waitForXPath('//*[@id="block-views-block-test-business-listing-view-block-4"]/div/div');
        const wrapper = await page_business.$x('//*[@id="block-views-block-test-business-listing-view-block-4"]/div/div');
        const items_business = await page_business.$$('.views-row');
        await page_business.waitFor(5000);
        const trends = await page_sport.$$('.view-content > .trending-list');
        const latest = await page_sport.$$('.trending-story-wrapper > .trending-list');
        //
        for (const trend of latest) {
            const link = await trend.$('a');
            const hed = await trend.$('h4');
            //
            let url = (link != null || undefined) ? await page_sport.evaluate(a => a.href, link) : null;
            let headline = (hed != null || undefined) ? await page_sport.evaluate(a => a.innerText, hed) : null;
            let url_src = uri_video;

            add_trends.push({
                src_name,
                url_src,
                "url": url,
                "headline": headline
            });
        }
        //
        await page_sport.close();
        for (const trend of trends) {
            try {
                const link = await trend.$('a');
                //
                let url = (link != null || undefined) ? await page_sport.evaluate(a => a.innerText, link) : null;
                let headline = (link != null || undefined) ? await page_sport.evaluate(a => a.href, link) : null;
                let url_src = uri_sport;
                add_trends.push({
                    src_name,
                    "url": url,
                    url_src,
                    "headline": headline
                });
            } catch (error) {
                console.log('\x1b[42m%s\x1b[0m', `From ${uri_video} loop: ${error.name}`)
            }
        }
        //
        for (const item of items_business) {
            try {
                const head = await item.$('h2');
                const image = await item.$('img');
                const sec = await item.$('.para-section-author');
                const para = await item.$('.para-section-text');
                //
                const headline = (head != null || undefined) ? await head.$eval('a', a => a.innerText) : null;
                const thumbnail = (image != null || undefined) ? await item.$eval('img', img => img.src) : null;
                const url = (head != null || undefined) ? await head.$eval('a', a => a.href) : null;
                const lede = (para != null || undefined) ? await para.$eval('div.field-content', div => div.innerText) : null;
                const date = (sec != null || undefined) ? await sec.$eval('span.field-content', span => span.innerText) : null;


                let empty = null;
                let emptyArr = "";
                let catLink = empty;
                let author = empty;
                let category = empty;
                let url_src = uri_video;
                let tag = category;
                let images = emptyArr;
                let vidLen = empty;
                let isVid = false;

                (url === null) ? false: add_business.push({
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
                });
            } catch (error) {
                console.log('\x1b[42m%s\x1b[0m', `From ${uri_business} loop: ${error.name}`)
                continue;
            }
        }
        //
        await page_business.close();
        console.log('\x1b[43m%s\x1b[0m', `Done: ${uri_business}`);
    } catch (error) {
        console.log('\x1b[41m%s\x1b[0m', `From ${uri_business} Main: ${error}`);
    }
}

// cron.schedule("0 */6 * * *", () => {
// (() => {
console.log('\x1b[46m%s\x1b[0m', "ENCA fired at: " + Date());
let source_sport = "https://www.enca.com/sports";
let source_video = "https://www.enca.com/watch";
let source_business = "https://www.enca.com/business";
//
main(source_sport, source_video, source_business);

// })();
// });
//
Routa.get('/enca', (req, res) => {
    res.send({
        "sport": add_sport,
        "video": add_video,
        "business": add_business,
        "trends": add_trends


    });
});
module.exports = Routa;
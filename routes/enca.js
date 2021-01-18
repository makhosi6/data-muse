require('dotenv').config();
const cron = require("node-cron");
const wsChromeEndpointurl = require('../browser');
const puppeteer = require('puppeteer');
const generateUniqueId = require('generate-unique-id');
const vars = require('../store/storeVars');
const express = require("express");
const Routa = express.Router();
///
let add_sport = [];
let add_video = [];
let add_business = [];
let add_trends = [];
let src_logo = "https://www.enca.com/sites/all/themes/custom/enca/images/eNCA_logo.svg";
let src_name = "eNCA";

async function main(uri_sport, uri_video, uri_business) {
    try {
          const browser = await puppeteer.connect({
        browserWSEndpoint: wsChromeEndpointurl,
        defaultViewport: null,
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
                let src_url = await page_sport.evaluate(() => location.origin);
                let empty = null;
                

                let catLink = uri_sport;
                let category = "sport";
                const id = generateUniqueId({
                    length: 32
                  });
                let tag = category;
                let images = empty;
                let vidLen = empty;
                let isVid = false;
                //
                let author = empty;
                let authors = empty;
                let tags = empty;
                let key = empty;
                let label = empty;
                let type = "card";
                //
                let subject = empty;
                let format = empty;
                let about = empty;
                //
                (url === null) ? false: await vars.interfaceAPI({
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
                });


            } catch (error) {
                console.log('\x1b[42m%s\x1b[0m', `From ${uri_sport} loop: ${error}`)
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
                let src_url = await page_video.evaluate(() => location.origin);

                let empty = null;
                const id = generateUniqueId({
                    length: 32
                  });
                let catLink = empty;
                let author = empty;
                let date = empty;
                let category = "video";
                let tag = category;
              
                let images = empty;
                let vidLen = empty;
                let isVid = true;
                 //
                 let authors = empty;
                 let tags = empty;
                 let type = "card";
                 let key = empty;
                 let label = empty;
                 //
                 let subject = empty;
                 let format = empty;
                 let about = empty;

                (url === null) ? false: await vars.interfaceAPI({
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
                    authors ,
                    date
                });


            } catch (error) {
                console.log('\x1b[42m%s\x1b[0m', `From ${uri_video} loop: ${error}`)
                continue;
            }
        }
        //
    

        const page_business = await browser.newPage();
        page_business.setUserAgent(vars.userAgent);
        await page_business.goto(uri_business, { waitUntil: 'networkidle2', timeout: 0 });
        await page_business.waitForXPath('//*[@id="block-views-block-test-business-listing-view-block-4"]/div/div');
        const wrapper = await page_business.$x('//*[@id="block-views-block-test-business-listing-view-block-4"]/div/div');
        const items_business = await page_business.$$('.views-row');
        await page_business.waitFor(5000);
        const trends = await page_business.$$('.view-content > .trending-list');
        const latest = await page_business.$$('.trending-story-wrapper > .trending-list');
        let empty = null;
        //
        for (const trend of latest) {
            // const link = await trend.$('a');
            // const hed = await trend.$('h4');
            // //
            // const id = generateUniqueId({
            //     length: 32
            //   });
            // let url = (link != null || undefined) ? await page_sport.evaluate(a => a.href, link) : null;
            // let headline = (hed != null || undefined) ? await page_sport.evaluate(a => a.innerText, hed) : null;
            // let src_url = await page_business.evaluate(() => location.origin);
            //  //
            //  let catLink = empty;
            //  let author = empty;
            //  let date = empty;
            //  let category = empty;
            //  let tag = category;
            //  let images = empty;
            //  //
            //  let vidLen = empty;
            //  let isVid = false;
            //  //
            //  let authors = empty;
            //  let tags = empty;
            //  let type = "card";
            //  let key = empty;
            //  let label = empty;
            //  let lede = empty;
            //  //
            //  let thumbnail = empty;
            //  let subject = empty;
            //  let format = empty;
            //  let about = empty;


            // add_business.push({
            //     id,
            //     url,
            //     headline,
            //     lede,
            //     thumbnail,
            //     category,
            //     catLink,
            //     images,
            //     //
            //     key,
            //     label,
            //     //
            //     subject,
            //     format,
            //     about,
            //     //
            //     src_name,
            //     src_url,
            //     src_logo,
            //     //
            //     isVid,
            //     vidLen ,
            //     //
            //     type,
            //     tag,
            //     tags,
            //     //
            //     author,
            //     authors ,
            //     date
            // });
        }
        //
    
        for (const trend of trends) {
            try {
                const link = await trend.$('a');
                //
                const id = generateUniqueId({
                    length: 32
                  });
                let headline = (link != null || undefined) ? await page_business.evaluate(a => a.innerText, link) : null;
                let url = (link != null || undefined) ? await page_business.evaluate(a => a.href, link) : null;
                let src_url = await page_business.evaluate(() => location.origin);
                let empty = null;
            //
                let lede = empty;
                let thumbnail = empty;
                let category = empty;
                let catLink = empty;
                let images = empty;
                //
                let key = empty;
                let label = empty;
                //
                let subject = empty;
                let format = empty;
                let about = empty;
          
                //
                let isVid = empty;
                let vidLen = empty;
                //
                let type = "trend";
                let tag = empty;
                let tags = empty;
                //
                let author = empty;
                let authors = empty;
                let date = empty;

                await vars.interfaceAPI({
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
                    authors,
                    date
                });
            } catch (error) {
                console.log('\x1b[42m%s\x1b[0m', `From ${uri_business} loop: ${error}`)
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
                
                let catLink = uri_business;
                let author = empty;
                let authors = empty;
                let category = "business";
                let src_url = await page_business.evaluate(() => location.origin);
                let tag = category;
                let tags = empty;
                let images = empty;
                let vidLen = empty;
                let isVid = false;
                const id = generateUniqueId({
                    length: 32
                  });
                 //
                 let type = "card"
                 let key = empty;
                 let label = empty;
                 //
                 let subject = empty;
                 let format = empty;
                 let about = empty;

                (url === null) ? false: await vars.interfaceAPI({
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
                });
            } catch (error) {
                console.log('\x1b[42m%s\x1b[0m', `From ${uri_business} loop: ${error}`)
                continue;
            }
        }
        //
        // console.log({page});
        await page_sport.close();
        await page_video.close(); 
        await page_business.close();
        console.log('\x1b[43m%s\x1b[0m', `Done: ${uri_business}`);
    } catch (error) {
        console.log('\x1b[41m%s\x1b[0m', `From ${uri_business} Main: ${error}`);
    }
}

let source_sport = "https://www.enca.com/sports";
let source_video = "https://www.enca.com/watch";
let source_business = "https://www.enca.com/business";
//
cron.schedule("0 */6 * * *", () => {
    console.log('\x1b[46m%s\x1b[0m', "ENCA fired at: " + Date());
    main(source_sport, source_video, source_business);
});
//
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
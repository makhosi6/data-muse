const express = require("express");
const Routa = express.Router();
require('dotenv').config();
const cron = require("node-cron");
const puppeteer = require('puppeteer');
const vars = require('../store/storeVars');
const generateUniqueId = require('generate-unique-id');
const wsChromeEndpointurl = require('../browser');
///

//
let news = [];
let src_logo = "https://citizen.co.za/wp-content/themes/citizen-v5-2/images/citizen_logo_footer_v2.png";
let src_name = "Citizen";

async function main(uri) {

    try {
        let url_src = uri;
          const browser = await puppeteer.connect({
        browserWSEndpoint: wsChromeEndpointurl,
        defaultViewport: null,
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
                const a = await each.$('.image-wrapper a');
                //
                let  src_url = await page.evaluate(() => location.origin);
                const thumbnail = await page.evaluate(a => a.src, get);
                const url = await page.evaluate(a => a.href, a);
                const headline = await each.$eval('h3 > a', span => span.innerText);
                const tag = await each.$eval('span.category-link > a', a => a.innerText);
                const catLink = await each.$eval('span.category-link > a', a => a.innerText);
                const lede = await each.$eval('.excerpt', span => span.innerText);
                // const ledeT = await each.$eval('span.js-shave', span => span.innerText);
                // let para = lede + ledeT;
                const id = generateUniqueId({length: 32});
                //
                let empty = null;
                let category = "sport";
                let author = empty;
                let date = empty;
                let tags = empty;
                let images = empty;
                let vidLen = empty;
                let isVid = false;
                let authors = empty;
                //
                let subject = empty
                let format = empty
                let about = empty;
               let key = empty
               
                let label = empty
                let type = "strip";

                news.push({
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
                console.log('\x1b[42m%s\x1b[0m', `From ${uri} loop: ${error}`)
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
                const tag = await page.evaluate(div => div.innerText, cat);
                const thumbnail = await page.evaluate(img => img.src, image);
                const url = await page.evaluate(a => a.href, cat);
                const headline = await item.$eval('.homelead2-headline-more-stories', a => a.innerText);
                //
                let  src_url = await page.evaluate(() => location.origin);
                const iHtml = await page.evaluate(el => el.innerHTML, item);
                const id = generateUniqueId({length: 32});
                let empty = null;
//
                let catLink = uri;
                let date = empty;
                let lede = empty;
                let author = empty;
                let authors = empty;
                let images = empty;
                let category = tag;
                let vidLen = empty;
                let isVid = false;
                //
                let subject = empty
                let format = empty
                let about = empty;
                
                //
                let key = empty
                let tags = empty
                let label = empty
let type = "title-only";
                news.push({
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
                console.log('\x1b[42m%s\x1b[0m', `From ${uri} loop: ${error}`)
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

        console.log('\x1b[46m%s\x1b[0m', "CITIZEN fired at:" + Date());
        main(source);
});
///
  
        //
Routa.get('/citizen', (req, res) => {
    res.send({

        news

    });
});
module.exports = Routa;
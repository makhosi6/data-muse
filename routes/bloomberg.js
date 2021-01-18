require('dotenv').config();
const cron = require("node-cron");
const scrollPageToBottom = require('puppeteer-autoscroll-down');
const vars = require('../store/storeVars');
const express = require("express");
const Routa = express.Router();
const generateUniqueId = require('generate-unique-id');
const wsChromeEndpointurl = require('../browser');
const puppeteer = require('puppeteer');
///

//
let news = [];

async function main(uri) {
    try {

             const browser = await puppeteer.connect({
      browserWSEndpoint: wsChromeEndpointurl,
      defaultViewport: null,
    });
        const page = await browser.newPage();
        await page.setViewport({
            width: 1920,
            height: 968
        });
        page.setUserAgent(vars.userAgent);
        await page.goto(uri, { waitUntil: 'networkidle2', timeout: 0 });
        await page.waitForSelector('.story-package-module__story.mod-story');
        let myVar = setInterval(() => scrollPageToBottom(page), 100);
        await page.waitFor(12300);
        clearInterval(myVar);
        const items = await page.$$('.story-package-module__story.mod-story');
        //
        for (const item of items) {
            try {
                //
                const get = await item.$('.bb-lazy-img__image');
                const f = await item.$('h3 > a');
                const time = await item.$('time');
                const cat = await item.$('.story-package-module__story__eyebrow > a');
                //
                const url = await page.evaluate(a => a.href, f);
                const categori = (cat != null || undefined) ? await page.evaluate(a => a.innerText, cat) : null;
                const catLink = (cat != null || undefined) ? await page.evaluate(a => a.href, cat) : null;
                const headline = await item.$eval('h3 > a', a => a.innerText);
                const date = (time != null || undefined) ? await page.evaluate(time => time.innerText, time) : null;
                const thumbnail = (get != null || undefined) ? await page.evaluate(img => img.src, get) : null;
                //
                let empty = null;
                

                let lede = empty;
                let author = empty;
                let authors = empty;
                let src_logo = "https://www.conviva.com/wp-content/uploads/2019/12/Bloomberg-logo-.png";
                let src_name = "Bloomberg";
                let vidLen = empty;
                let isVid = false;
                let  src_url = await page.evaluate(() => location.origin);
                let images = empty;
                let type = "title-only";
                const id = generateUniqueId({
                    length: 32
                  });
                  let category = "africa";
                let tag = categori;
                //
                let key = empty;
                let tags = empty;
                    let label = empty;
                    //
                    let subject = empty;
                    let format = empty;
                    let about = empty;
                    //
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
                    authors ,
                    date
                })
            } catch (error) {
                console.log('\x1b[42m%s\x1b[0m', `From ${uri} loop: ${error}`)
                continue;
            }

        }
        //
        await page.close();
        console.log('\x1b[43m%s\x1b[0m', `Done: ${uri}`);

    } catch (error) {
        console.log('\x1b[41m%s\x1b[0m', `From ${uri} Main: ${error}`);
    }
}
let source = "https://www.bloomberg.com/africa";

cron.schedule("0 3 * * *", () => {

    console.log('\x1b[46m%s\x1b[0m', "BLOOMBERG fired at:" + Date());
        main(source);
});

//
Routa.get('/bloomberg', (req, res) => {
    res.send({

        news

    });
});
module.exports = Routa;
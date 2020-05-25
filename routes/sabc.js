const express = require('express');
const sabcBusiness = express.Router();
const puppeteer = require('puppeteer');
require('dotenv').config()
const BROWSER = process.env.BROWSER;

const IS_PRODUCTION = process.env.NODE_ENV === 'production';
///
process.setMaxListeners(Infinity);
//
let add_business = [];
let add_news = [];
let add_politics = [];
let add_science = [];
let add_sport = [];
let add_world = [];

async function main(uri_business, uri_news, uri_politics, uri_science, uri_sport, uri_world) {

    try {

        const browser = (IS_PRODUCTION) ?
            await puppeteer.connect({
                browserWSEndpoint: `wss://chrome.browserless.io/?token=${BROWSER}`
            }) :
            await puppeteer.launch({
                args: [
                    "--ignore-certificate-errors",
                    "--no-sandbox",
                    '--disable-dev-shm-usage',
                    "--disable-setuid-sandbox",
                    "--window-size=1920,1080",
                    "--disable-accelerated-2d-canvas",
                    "--disable-gpu"
                ],
                defaultViewport: null,
                executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe'

            });

        const page_business = await browser.newPage();
        page_business.setUserAgent('Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML; like Gecko) snap Chromium/80.0.3987.122 Chrome/80.0.3987.122 Safari/537.36');
        await page_business.goto(uri_business, { waitUntil: 'networkidle2', timeout: 0 });
        await page_business.waitForSelector('.sabc_cat_list_item');
        const items_business = await page_business.$$('.sabc_cat_list_item');
        await page_business.waitFor(125000);
        //
        for (const item of items_business) {
            try {

                const image = await item.$('.sabc_cat_list_item_image > img');
                const title = await item.$('.sabc_cat_list_item_title > a');

                //sabc_cat_item_date
                const thumbnail = await page_business.evaluate(img => img.src, image);
                const date = await item.$eval('.sabc_cat_item_date', span => span.innerText);
                const lede = await item.$eval('.sabc_cat_list_item_summary', p => p.innerText);
                const link = await page_business.evaluate(a => a.href, title);
                const headline = await page_business.evaluate(a => a.innerText, title);
                //
                const iHtml = await page_business.evaluate(el => el.innerHTML, item);

                add_business.push({
                    "date": date,
                    "lede": lede,
                    "url": link,
                    "thumbnail": thumbnail,
                    "headline": headline,
                })
            } catch (error) {
                console.log(`From ${uri_business} loop: ${error}`.bgMagenta);
                continue;
            }
        }
        // 

        const page_news = await browser.newPage();
        page_news.setUserAgent('Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML; like Gecko) snap Chromium/80.0.3987.122 Chrome/80.0.3987.122 Safari/537.36');

        await page_news.goto(uri_news, { waitUntil: 'networkidle2', timeout: 0 });

        await page_news.waitForSelector('.ppc');
        //
        const items_news = await page_news.$$('.ppc');
        await page_news.waitFor(125000);
        //
        for (const item of items_news) {
            try {
                // const left = await item.$('.right > .content > .article-synopsis.d-none.d-md-block');
                const cat = await item.$('.home_page_category > a');
                const image = await item.$('.category-image > img');
                const title = await item.$('.category-title > a');

                //
                const thumbnail = await page_news.evaluate(img => img.src, image);
                const date = await item.$eval('p.ppc-first-post-date', p => p.innerText);
                const lede = await item.$eval('p.ppc-first-post-excerpt', p => p.innerText);
                const category = await page_news.evaluate(a => a.innerText, cat);
                const link = await page_news.evaluate(a => a.href, title);
                const headline = await page_news.evaluate(a => a.innerText, title);
                //

                const iHtml = await page_news.evaluate(el => el.innerHTML, item);

                add_news.push({
                    "date": date,
                    "lede": lede,
                    "category": category,
                    "url": link,
                    "thumbnail": thumbnail,
                    "headline": headline,
                })
            } catch (error) {
                console.log(`From ${uri_news} loop: ${error}`.bgMagenta);
                continue;
            }
        }

        // 
        const page_politics = await browser.newPage();
        page_politics.setUserAgent('Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML; like Gecko) snap Chromium/80.0.3987.122 Chrome/80.0.3987.122 Safari/537.36');

        await page_politics.goto(uri_politics, { waitUntil: 'networkidle2', timeout: 0 });

        await page_politics.waitForSelector('.sabc_cat_list_item');
        //
        const items_politics = await page_politics.$$('.sabc_cat_list_item');
        await page_politics.waitFor(125000);
        //
        for (const item of items_politics) {
            try {
                const image = await item.$('.sabc_cat_list_item_image > img');
                const title = await item.$('.sabc_cat_list_item_title > a');
                //
                const thumbnail = await page_politics.evaluate(img => img.src, image);
                const date = await item.$eval('.sabc_cat_item_date', span => span.innerText);
                const lede = await item.$eval('.sabc_cat_list_item_summary', p => p.innerText);
                const link = await page_politics.evaluate(a => a.href, title);
                const headline = await page_politics.evaluate(a => a.innerText, title);
                //


                const iHtml = await page_politics.evaluate(el => el.innerHTML, item);

                add_politics.push({
                    "date": date,
                    "lede": lede,
                    "url": link,
                    "thumbnail": thumbnail,
                    "headline": headline,
                })
            } catch (error) {
                console.log(`From ${uri_politics} loop: ${error}`.bgMagenta);
                continue;
            }
        }


        // 


        const page_science = await browser.newPage();
        page_science.setUserAgent('Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML; like Gecko) snap Chromium/80.0.3987.122 Chrome/80.0.3987.122 Safari/537.36');

        await page_science.goto(uri_science, { waitUntil: 'networkidle2', timeout: 0 });

        await page_science.waitForSelector('.sabc_cat_list_item');
        //
        const items_science = await page_science.$$('.sabc_cat_list_item');
        await page_science.waitFor(125000);
        //
        for (const item of items_science) {
            try {
                const image = await item.$('.sabc_cat_list_item_image > img');
                const title = await item.$('.sabc_cat_list_item_title > a');

                //sabc_cat_item_date
                const thumbnail = await page_science.evaluate(img => img.src, image);
                const date = await item.$eval('.sabc_cat_item_date', span => span.innerText);
                const lede = await item.$eval('.sabc_cat_list_item_summary', p => p.innerText);
                // const category = await page.evaluate(a => a.innerText, cat);
                const link = await page_science.evaluate(a => a.href, title);
                const headline = await page_science.evaluate(a => a.innerText, title);
                //

                const iHtml = await page_science.evaluate(el => el.innerHTML, item);

                add_science.push({
                    "date": date,
                    "lede": lede,
                    "url": link,
                    "thumbnail": thumbnail,
                    "headline": headline,
                })
            } catch (error) {
                console.log(`From ${uri_science} loop: ${error}`.bgMagenta);
                continue;
            }
        }


        // 



        const page_sport = await browser.newPage();
        page_sport.setUserAgent('Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML; like Gecko) snap Chromium/80.0.3987.122 Chrome/80.0.3987.122 Safari/537.36');

        await page_sport.goto(uri_sport, { waitUntil: 'networkidle2', timeout: 0 });

        await page_sport.waitForSelector('.sabc_cat_list_item');
        //
        const items_sport = await page_sport.$$('.sabc_cat_list_item');
        await page_sport.waitFor(125000);
        //
        for (const item of items_sport) {
            try {
                // const left = await item.$('.right > .content > .article-synopsis.d-none.d-md-block');
                // const cat = await item.$('.home_page_category > a');
                const image = await item.$('.sabc_cat_list_item_image > img');
                const title = await item.$('.sabc_cat_list_item_title > a');

                //sabc_cat_item_date
                const thumbnail = await page_sport.evaluate(img => img.src, image);
                const date = await item.$eval('.sabc_cat_item_date', span => span.innerText);
                const lede = await item.$eval('.sabc_cat_list_item_summary', p => p.innerText);
                // const category = await page.evaluate(a => a.innerText, cat);
                const link = await page_sport.evaluate(a => a.href, title);
                const headline = await page_sport.evaluate(a => a.innerText, title);
                //
                // let a = thumbnail.split('url("');
                // let b = a[1];
                // let c = b.split('")');
                // let d = c[0];

                const iHtml = await page_sport.evaluate(el => el.innerHTML, item);

                add_sport.push({
                    "date": date,
                    "lede": lede,
                    // "category": category,
                    "url": link,
                    "thumbnail": thumbnail,
                    "headline": headline,
                })
            } catch (error) {
                console.log(`From ${uri_sport} loop: ${error}`.bgMagenta);
                continue;
            }
        }

        // 


        const page_world = await browser.newPage();
        page_world.setUserAgent('Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML; like Gecko) snap Chromium/80.0.3987.122 Chrome/80.0.3987.122 Safari/537.36');

        await page_world.goto(uri_world, { waitUntil: 'networkidle2', timeout: 0 });

        await page_world.waitForSelector('.sabc_cat_list_item');
        //
        const items_world = await page_world.$$('.sabc_cat_list_item');
        await page_world.waitFor(125000);
        //
        for (const item of items_world) {
            try {
                // const left = await item.$('.right > .content > .article-synopsis.d-none.d-md-block');
                // const cat = await item.$('.home_page_category > a');
                const image = await item.$('.sabc_cat_list_item_image > img');
                const title = await item.$('.sabc_cat_list_item_title > a');

                //sabc_cat_item_date
                const thumbnail = await page_world.evaluate(img => img.src, image);
                const date = await item.$eval('.sabc_cat_item_date', span => span.innerText);
                const lede = await item.$eval('.sabc_cat_list_item_summary', p => p.innerText);
                // const category = await page.evaluate(a => a.innerText, cat);
                const link = await page_world.evaluate(a => a.href, title);
                const headline = await page_world.evaluate(a => a.innerText, title);
                //
                // let a = thumbnail.split('url("');
                // let b = a[1];
                // let c = b.split('")');
                // let d = c[0];

                const iHtml = await page_world.evaluate(el => el.innerHTML, item);

                add_world.push({
                    "date": date,
                    "lede": lede,
                    // "category": category,
                    "url": link,
                    "thumbnail": thumbnail,
                    "headline": headline,
                })
            } catch (error) {
                console.log(`From ${uri_world} loop: ${error}`.bgMagenta);
                continue;
            }
        }

        console.log(`Done: ${uri_business}`.bgYellow);

        browser.close();
    } catch (error) {
        console.log(`From ${uri_business} Main: ${error}`.bgRed);
    }
}
let source_business = "https://www.sabcnews.com/sabcnews/category/business/";
let source_news = "https://www.sabcnews.com/sabcnews/";
let source_politics = "https://www.sabcnews.com/sabcnews/category/politics/";
let source_science = "https://www.sabcnews.com/sabcnews/category/sci-tech/";
let source_sport = "https://www.sabcnews.com/sabcnews/category/sport/";
let source_world = "https://www.sabcnews.com/sabcnews/category/world/";
//
main(source_business, source_news, source_politics, source_science, source_sport, source_world)
    /////
sabcBusiness.get('/sabc', (req, res) => {
    res.send({

        "sabcBusiness": add_business,
        "sabcNews": add_news,
        "sabcPolitics": add_politics,
        "sabcScience": add_science,
        "sabcSport": add_sport,
        "sabcWorld": add_world
    });
})

module.exports = sabcBusiness;
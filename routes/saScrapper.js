const puppeteer = require('puppeteer');
const express = require('express');
const { bgYellow } = require('colors');
require('dotenv').config()
const BROWSER = process.env.BROWSER;
const saFinance = express.Router();
const browser = require('../browser');
//

process.setMaxListeners(Infinity);

let data_finance = [];
let data_motoring = [];
let data_life = [];
let data_news = [];
let data_tech = [];
let data_sport = [];
///
async function main(uri_finance, uri_motoring, uri_life, uri_news, uri_tech, uri_sport) {
    try {

        const page_finance = await browser.newPage();
        page_finance.setUserAgent('Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML; like Gecko) snap Chromium/80.0.3987.122 Chrome/80.0.3987.122 Safari/537.36');

        await page_finance.goto(uri_finance, { waitUntil: 'networkidle2', timeout: 0 });

        await page_finance.waitForSelector('.jeg_post');
        const items_finance = await page_finance.$$('.jeg_posts > .jeg_post');
        // 
        for (const item of items_finance) {
            try {
                const iHtml = await page_finance.evaluate(el => el.innerHTML, item);
                //
                const headline = await item.$('h3.jeg_post_title');
                const time = await item.$('.jeg_meta_date');
                const publisher = await item.$('.jeg_meta_author');
                const cat = await item.$('.jeg_post_category');
                const wrapper = await item.$('.jeg_thumb');
                //
                const url = (headline != null || undefined) ? await headline.$eval('a', a => a.href) : null;
                const headlineText = (headline != null || undefined) ? await headline.$eval('a', a => a.innerText) : null;
                const thumbnail = (wrapper != null || undefined) ? await item.$eval('img', img => img.dataset.src) : null;
                const lede = (item != null || undefined) ? await item.$eval('p', p => p.innerText) : null;
                const author = (publisher != null || undefined) ? await publisher.$eval('a', a => a.innerText) : null;
                const date = (time != null || undefined) ? await time.$eval('a', a => a.innerText) : null;
                const topic = (cat != null || undefined) ? await cat.$eval('a', a => a.innerText) : null;
                //  

                data_finance.push({

                    "url": url,
                    "lede": lede,
                    "headline": headlineText,
                    "thumbnail": thumbnail,
                    "category": topic,
                    "author": author,
                    "date": date,
                })

            } catch (error) {
                console.log(`From ${uri_finance} loop: ${error}`.bgMagenta);
                continue;
            }
        }
        //
        const page_motoring = await browser.newPage();
        page_motoring.setUserAgent('Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML; like Gecko) snap Chromium/80.0.3987.122 Chrome/80.0.3987.122 Safari/537.36');
        await page_motoring.goto(uri_motoring, { waitUntil: 'networkidle2', timeout: 0 });
        await page_motoring.waitForSelector('.jeg_post');
        const items_motoring = await page_motoring.$$('.jeg_posts > .jeg_post');
        // 
        for (const item of items_motoring) {
            try {
                const iHtml = await page_motoring.evaluate(el => el.innerHTML, item);
                //
                const headline = await item.$('h3.jeg_post_title');
                const time = await item.$('.jeg_meta_date');
                const publisher = await item.$('.jeg_meta_author');
                const cat = await item.$('.jeg_post_category');
                const wrapper = await item.$('.jeg_thumb');
                //
                const url = (headline != null || undefined) ? await headline.$eval('a', a => a.href) : null;
                const headlineText = (headline != null || undefined) ? await headline.$eval('a', a => a.innerText) : null;
                const thumbnail = (wrapper != null || undefined) ? await item.$eval('img', img => img.dataset.src) : null;
                const lede = (item != null || undefined) ? await item.$eval('p', p => p.innerText) : null;
                const author = (publisher != null || undefined) ? await publisher.$eval('a', a => a.innerText) : null;
                const date = (time != null || undefined) ? await time.$eval('a', a => a.innerText) : null;
                const topic = (cat != null || undefined) ? await cat.$eval('a', a => a.innerText) : null;
                //  
                data_motoring.push({

                    "url": url,
                    "lede": lede,
                    "headline": headlineText,
                    "thumbnail": thumbnail,
                    "category": topic,
                    "author": author,
                    "date": date,
                })

            } catch (error) {
                console.log(`From ${uri_motoring} loop: ${error}`.bgMagenta);
                continue;
            }
        }


        //

        const page_life = await browser.newPage();
        page_life.setUserAgent('Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML; like Gecko) snap Chromium/80.0.3987.122 Chrome/80.0.3987.122 Safari/537.36');

        await page_life.goto(uri_life, { waitUntil: 'networkidle2', timeout: 0 });

        await page_life.waitForSelector('.jeg_post');
        const items_life = await page_life.$$('.jeg_posts > .jeg_post');

        // 
        for (const item of items_life) {
            try {
                const iHtml = await page_life.evaluate(el => el.innerHTML, item);
                //
                const headline = await item.$('h3.jeg_post_title');
                const time = await item.$('.jeg_meta_date');
                const publisher = await item.$('.jeg_meta_author');
                const cat = await item.$('.jeg_post_category');
                const wrapper = await item.$('.jeg_thumb');
                //
                const url = (headline != null || undefined) ? await headline.$eval('a', a => a.href) : null;
                const headlineText = (headline != null || undefined) ? await headline.$eval('a', a => a.innerText) : null;
                const thumbnail = (wrapper != null || undefined) ? await item.$eval('img', img => img.dataset.src) : null;
                const lede = (item != null || undefined) ? await item.$eval('p', p => p.innerText) : null;
                const author = (publisher != null || undefined) ? await publisher.$eval('a', a => a.innerText) : null;
                const date = (time != null || undefined) ? await time.$eval('a', a => a.innerText) : null;
                const topic = (cat != null || undefined) ? await cat.$eval('a', a => a.innerText) : null;
                //  

                data_life.push({

                    "url": url,
                    "lede": lede,
                    "headline": headlineText,
                    "thumbnail": thumbnail,
                    "category": topic,
                    "author": author,
                    "date": date,
                })

            } catch (error) {
                console.log(`From ${uri_life} loop: ${error}`.bgMagenta);
                continue;
            }
        }


        //

        const page_news = await browser.newPage();
        page_news.setUserAgent('Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML; like Gecko) snap Chromium/80.0.3987.122 Chrome/80.0.3987.122 Safari/537.36');

        await page_news.goto(uri_news, { waitUntil: 'networkidle2', timeout: 0 });

        await page_news.waitForSelector('.jeg_post');
        const items_news = await page_news.$$('.jeg_posts > .jeg_post');

        // 
        for (const item of items_news) {
            try {
                const iHtml = await page_news.evaluate(el => el.innerHTML, item);
                //
                const headline = await item.$('h3.jeg_post_title');
                const time = await item.$('.jeg_meta_date');
                const publisher = await item.$('.jeg_meta_author');
                const cat = await item.$('.jeg_post_category');
                const wrapper = await item.$('.jeg_thumb');
                //
                const url = (headline != null || undefined) ? await headline.$eval('a', a => a.href) : null;
                const headlineText = (headline != null || undefined) ? await headline.$eval('a', a => a.innerText) : null;
                const thumbnail = (wrapper != null || undefined) ? await item.$eval('img', img => img.dataset.src) : null;
                const lede = (item != null || undefined) ? await item.$eval('p', p => p.innerText) : null;
                const author = (publisher != null || undefined) ? await publisher.$eval('a', a => a.innerText) : null;
                const date = (time != null || undefined) ? await time.$eval('a', a => a.innerText) : null;
                const topic = (cat != null || undefined) ? await cat.$eval('a', a => a.innerText) : null;
                //  

                data_news.push({

                    "url": url,
                    "lede": lede,
                    "headline": headlineText,
                    "thumbnail": thumbnail,
                    "category": topic,
                    "author": author,
                    "date": date,
                })

            } catch (error) {
                console.log(`From ${uri_news} loop: ${error}`.bgMagenta);
                continue;
            }
        }


        //

        const page_tech = await browser.newPage();
        page_tech.setUserAgent('Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML; like Gecko) snap Chromium/80.0.3987.122 Chrome/80.0.3987.122 Safari/537.36');

        await page_tech.goto(uri_tech, { waitUntil: 'networkidle2', timeout: 0 });

        await page_tech.waitForSelector('.jeg_post');
        const items_tech = await page_tech.$$('.jeg_posts > .jeg_post');

        // 
        for (const item of items_tech) {
            try {
                const iHtml = await page_tech.evaluate(el => el.innerHTML, item);
                //
                const headline = await item.$('h3.jeg_post_title');
                const time = await item.$('.jeg_meta_date');
                const publisher = await item.$('.jeg_meta_author');
                const cat = await item.$('.jeg_post_category');
                const wrapper = await item.$('.jeg_thumb');
                //
                const url = (headline != null || undefined) ? await headline.$eval('a', a => a.href) : null;
                const headlineText = (headline != null || undefined) ? await headline.$eval('a', a => a.innerText) : null;
                const thumbnail = (wrapper != null || undefined) ? await item.$eval('img', img => img.dataset.src) : null;
                const lede = (item != null || undefined) ? await item.$eval('p', p => p.innerText) : null;
                const author = (publisher != null || undefined) ? await publisher.$eval('a', a => a.innerText) : null;
                const date = (time != null || undefined) ? await time.$eval('a', a => a.innerText) : null;
                const topic = (cat != null || undefined) ? await cat.$eval('a', a => a.innerText) : null;
                //  

                data_tech.push({
                    "url": url,
                    "lede": lede,
                    "headline": headlineText,
                    "thumbnail": thumbnail,
                    "category": topic,
                    "author": author,
                    "date": date,
                })


            } catch (error) {
                console.log(`From ${uri_tech} loop: ${error}`.bgMagenta);
                continue;
            }
        }


        //


        const page_sport = await browser.newPage();
        page_sport.setUserAgent('Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML; like Gecko) snap Chromium/80.0.3987.122 Chrome/80.0.3987.122 Safari/537.36');

        await page_sport.goto(uri_sport, { waitUntil: 'networkidle2', timeout: 0 });

        await page_sport.waitForSelector('.jeg_post');
        const items_sport = await page_sport.$$('.jeg_posts > .jeg_post');

        // 
        for (const item of items_sport) {
            try {
                const iHtml = await page_sport.evaluate(el => el.innerHTML, item);
                //
                const headline = await item.$('h3.jeg_post_title');
                const time = await item.$('.jeg_meta_date');
                const publisher = await item.$('.jeg_meta_author');
                const cat = await item.$('.jeg_post_category');
                const wrapper = await item.$('.jeg_thumb');
                //
                const url = (headline != null || undefined) ? await headline.$eval('a', a => a.href) : null;
                const headlineText = (headline != null || undefined) ? await headline.$eval('a', a => a.innerText) : null;
                const thumbnail = (wrapper != null || undefined) ? await item.$eval('img', img => img.dataset.src) : null;
                const lede = (item != null || undefined) ? await item.$eval('p', p => p.innerText) : null;
                const author = (publisher != null || undefined) ? await publisher.$eval('a', a => a.innerText) : null;
                const date = (time != null || undefined) ? await time.$eval('a', a => a.innerText) : null;
                const topic = (cat != null || undefined) ? await cat.$eval('a', a => a.innerText) : null;
                //  

                data_sport.push({

                    "url": url,
                    "lede": lede,
                    "headline": headlineText,
                    "thumbnail": thumbnail,
                    "category": topic,
                    "author": author,
                    "date": date,
                })


            } catch (error) {
                console.log(`From ${uri_sport} loop: ${error}`.bgMagenta);
                continue;
            }
        }


        //
        //
        //
        console.log(`Done: ${uri_finance}`.bgYellow);


    } catch (error) {
        console.log(`From ${uri_news} loop: ${error}`.bgRed);
    }
}
let source_finance = "https://www.thesouthafrican.com/news/finance/";
let source_motoring = "https://www.thesouthafrican.com/lifestyle/motoring/";
let source_life = "https://www.thesouthafrican.com/lifestyle/";
let source_news = "https://www.thesouthafrican.com/news/finance/";
let source_tech = "https://www.thesouthafrican.com/technology/";
let source_sport = "https://www.thesouthafrican.com/sport/";
main(source_finance, source_motoring, source_life, source_news, source_tech, source_sport)
    /////////////
saFinance.get('/sa-scrapper', (req, res) => {
    res.send({

        "saFinance": data_finance,
        "saMotoring": data_motoring,
        "saLife": data_life,
        "saNews": data_news,
        "saTech": data_tech,
        "saSport": data_sport
    });
})

module.exports = saFinance;
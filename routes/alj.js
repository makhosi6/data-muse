const express = require('express');
require('dotenv').config()
const aljRouta = express.Router();
const puppeteer = require('puppeteer');
const BROWSER = process.env.BROWSER;
const IS_PRODUCTION = process.env.NODE_ENV === 'production';
//
process.setMaxListeners(Infinity);
///
let add_news = [];
let add_docs = [];
let add_africa = [];
let add_trending = [];

async function main(uri_docs, uri_africa, uri_news, uri_trending) {

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

        const page_docs = await browser.newPage();
        page_docs.setUserAgent('Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML; like Gecko) snap Chromium/80.0.3987.122 Chrome/80.0.3987.122 Safari/537.36');

        await page_docs.goto(uri_docs, { waitUntil: 'networkidle2', timeout: 0 });

        await page_docs.waitForSelector('div.owl-wrapper');
        ////LOOP ONE
        const items_docs = await page_docs.$$('#ID0R > div.owl-wrapper-outer > div.owl-wrapper > div.owl-item');
        //
        for (const item of items_docs) {
            try {
                const tag = await item.$('h4.heading-section');
                const anchor = await item.$('a.play');
                //
                const tagText = await tag.$eval('a', a => a.innerText);
                const link = await page_docs.evaluate(a => a.href, anchor);
                const lede = await item.$eval('p', p => p.innerText);
                const thumbnail = await item.$eval('img', img => img.src);
                const headlineText = await item.$eval('img', img => img.title);
                let end = tagText.replace(/ /g, "_");

                add_docs.push({
                    "url": link,
                    "headline": headlineText,
                    "thumbnail": thumbnail,
                    "tag": end,
                    "lede": lede
                })
            } catch (error) {
                console.log(`From ${uri_docs} loop: ${error}`.bgMagenta);
                continue;
            }
        }
        //LOOP TWO
        const emAll_docs = await page_docs.$$('.wrapper > .item.blurb');

        for (const el of emAll_docs) {
            try {


                const tag = await el.$('h4.heading-section');
                const anchor = await el.$('a.play');
                const para = await el.$('p');
                const tags = await el.$$('p.meta > a');
                //
                let hashTAg = [];
                for (const tagg of tags) {
                    const tagText2 = await page_docs.evaluate(a => a.innerText, tagg);
                    let txt = tagText2.replace(/ /g, "_");
                    hashTAg.push(txt);
                }
                const tagText = await tag.$eval('a', a => a.innerText);
                const link = await page_docs.evaluate(a => a.href, anchor);
                const lede = await page_docs.evaluate(p => p.innerText, para);
                const thumbnail = await el.$eval('img', img => img.src);
                const headlineText = await el.$eval('img', img => img.title);

                let end = tagText.replace(/ /g, "_");

                hashTAg.push(end);
                add_docs.push({
                    "url": link,
                    "headline": headlineText,
                    "thumbnail": thumbnail,
                    "tag": hashTAg,
                    "lede": lede
                })
            } catch (error) {
                console.log(`From ${uri_docs} loop: ${error}`.bgMagenta);
            }
        }
        //LOOP three 
        const comps_docs = await page_docs.$$('#shows-catchup > article.item.blurb');
        //

        for (const comp of comps_docs) {

            try {
                const tag = await comp.$('h4.heading-section');
                const anchor = await comp.$('a.play');
                //
                const tagText = await tag.$eval('a', a => a.innerText);
                const link = await page_docs.evaluate(a => a.href, anchor);
                const lede = await comp.$eval('p', p => p.innerText);
                const thumbnail = await comp.$eval('img', img => img.src);
                const headlineText = await comp.$eval('img', img => img.title);
                let end = tagText.replace(/ /g, "_");

                add_docs.push({
                    "url": link,
                    "headline": headlineText,
                    "thumbnail": thumbnail,
                    "tag": end,
                    "lede": lede
                })

            } catch (error) {
                console.log(`From ${uri_docs} loop: ${error}`.bgMagenta);
                continue;
            }
            // page
        }
        //


        const page_africa = await browser.newPage();
        page_africa.setUserAgent('Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML; like Gecko) snap Chromium/80.0.3987.122 Chrome/80.0.3987.122 Safari/537.36');
        await page_africa.goto(uri_africa, { waitUntil: 'networkidle2', timeout: 0 });
        await page_africa.waitForSelector('#btn_showmore_b1_418');
        await page_africa.waitFor(9000);
        await page_africa.click('#btn_showmore_b1_418');
        await page_africa.waitForSelector('#btn_showmore_b1_418');
        await page_africa.waitFor(9000);
        await page_africa.click('#btn_showmore_b1_418');
        await page_africa.waitForSelector('#btn_showmore_b1_418');
        await page_africa.waitFor(9000);
        const items_africa = await page_africa.$$('.topics-sec-item');
        await page_africa.waitFor(5000);
        //
        for (const item of items_africa) {
            //
            try {
                let media = await item.$('div.col-sm-5.topics-sec-item-img > a:nth-child(2)');
                const thumbnail = (media != null || undefined) ? await media.$eval('img', img => img.dataset.src) : null;
                const headline = await item.$eval('h2', h2 => h2.innerText);
                const topic = await item.$eval('a.topics-sec-item-label', a => a.innerText);
                const date = await item.$eval('time#PubTime', time => time.innerText);
                const lede = await item.$eval('p.topics-sec-item-p', p => p.innerText);
                const time = await item.$('.cardsvideoduration');
                const timeStamp = (time != null || undefined) ? await item.$eval("div.cardsvideoduration", div => div.innerText) : null;

                let isVid = (timeStamp !== null) ? true : false;
                let url = await item.$eval('a', a => a.href);
                ///////

                add_africa.push({
                    "url": url,
                    "lede": lede,
                    "headline": headline,
                    "thumbnail": "https://www.aljazeera.com" + thumbnail,
                    "category": topic,
                    "isVid": isVid,
                    "time stamp": timeStamp,
                    "date": date,
                })
            } catch (error) {
                console.log(`From ${uri_africa} loop: ${error}`.bgMagenta);
                continue;
            }
        }

        //

        const page_news = await browser.newPage();
        page_news.setUserAgent('Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML; like Gecko) snap Chromium/80.0.3987.122 Chrome/80.0.3987.122 Safari/537.36');
        await page_news.goto(uri_news, { waitUntil: 'networkidle2', timeout: 0 });
        await page_news.waitForSelector('#btn_showmore_b1_418');
        await page_news.waitFor(9000);
        await page_news.click('#btn_showmore_b1_418');
        await page_news.waitForSelector('#btn_showmore_b1_418');
        await page_news.waitFor(9000);
        await page_news.click('#btn_showmore_b1_418');
        await page_news.waitForSelector('#btn_showmore_b1_418');
        await page_news.waitFor(9000);
        const items_news = await page_news.$$('.topics-sec-item');
        await page_news.waitFor(5000);
        //
        for (const item of items_news) {
            //
            try {
                let media = await item.$('div.col-sm-5.topics-sec-item-img > a:nth-child(2)');
                const thumbnail = (media != null || undefined) ? await media.$eval('img', img => img.dataset.src) : null;
                const headline = await item.$eval('h2', h2 => h2.innerText);
                const topic = await item.$eval('a.topics-sec-item-label', a => a.innerText);
                const date = await item.$eval('time#PubTime', time => time.innerText);
                const lede = await item.$eval('p.topics-sec-item-p', p => p.innerText);
                const time = await item.$('.cardsvideoduration');
                const timeStamp = (time != null || undefined) ? await item.$eval("div.cardsvideoduration", div => div.innerText) : null;
                let isVid = (timeStamp !== null) ? true : false;
                let url = await item.$eval('a', a => a.href);
                ///////

                add_news.push({
                    "url": url,
                    "lede": lede,
                    "headline": headline,
                    "thumbnail": "https://www.aljazeera.com" + thumbnail,
                    "category": topic,
                    "isVid": isVid,
                    "time stamp": timeStamp,
                    "date": date,
                })
            } catch (error) {
                console.log(`From ${uri_news} loop: ${error}`.bgMagenta);
                continue;
            }
        }
        //

        const page_trending = await browser.newPage();
        page_trending.setUserAgent('Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML; like Gecko) snap Chromium/80.0.3987.122 Chrome/80.0.3987.122 Safari/537.36');
        await page_trending.goto(uri_trending, { waitUntil: 'networkidle2', timeout: 0 });
        await page_trending.waitForSelector('.latest-news-topic-trending');
        const items_trending = await page_trending.$$('#trending-widget > .latest-news-topic-trending');

        await page_trending.waitFor(5000);
        //
        for (const item of items_trending) {
            try {
                const headline = await item.$('.news-trending-txt');
                //
                const url = (headline != null || undefined) ? await headline.$eval('a', a => a.href) : null;
                const headlineText = await headline.$eval('p', p => p.innerText);

                add_trending.push({
                    "url": url,
                    "headline": headlineText
                })
            } catch (error) {
                console.log(`From ${uri_trending} loop: ${error}`.bgMagenta);
                continue;
            }
        }

        console.log(`Done: ${uri_docs}`.bgYellow);

        browser.close();
    } catch (error) {
        console.log(`From ${uri_docs} Main: ${error}`.bgRed);
    }
}
let source_docs = "https://www.aljazeera.com/documentaries/";
let source_africa = "https://www.aljazeera.com/topics/regions/africa.html";
let source_trending = "https://www.aljazeera.com/";
let source_news = "https://www.aljazeera.com/topics/regions/africa.html";
//
main(source_docs, source_africa, source_news, source_trending);
/////////////
aljRouta.get('/alj', (req, res) => {
    res.send({
        "aljDocs": add_docs,
        "aljAfrica": add_africa,
        "aljNews": add_news,
        "aljTrending": add_trending
    });
})
module.exports = aljRouta;
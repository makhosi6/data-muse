require('dotenv').config();
const cron = require("node-cron");
const wsChromeEndpointurl = require('../browser');
const puppeteer = require('puppeteer');
process.setMaxListeners(Infinity);
const vars = require('../store/storeVars');
const express = require("express");
const Routa = express.Router();
//
let add_news = [];
let add_mostPopula = [];
let add_study = [];
let add_video = [];
let src_name = 'HBR';
let src = "https://www.logolynx.com/images/logolynx/s_e5/e5f4b05f3bb630f8179f1dc505dea803.png";
async function main(url_news, uri_mostPopula, uri_study, uri_video) {
    try {

        const browser = await puppeteer.connect({
            browserWSEndpoint: wsChromeEndpointurl,
            defaultViewport: null
        });
        const page_news = await browser.newPage();
        page_news.setUserAgent(vars.userAgent);
        await page_news.goto(url_news, { waitUntil: 'networkidle2', timeout: 0 });
        await page_news.waitForSelector('.stream-item');
        await page_news.waitFor(13000);
        const items_news = await page_news.$$('.stream-item.overflow-hidden');

        //
        for (const item of items_news) {
            try {
                const image = await item.$('img');
                const thumbnail = (image != null || undefined) ? await item.$eval('img', img => img.src) : null;
                const head = await item.$('.hed');
                const tag = await item.$eval('a.topic', a => a.innerText);
                const category = await item.$eval('span.content-type', span => span.innerText)
                const a = await item.$('.byline-list');
                const authors = (a != null || undefined) ? await a.$$('li') : null;
                const lede = await item.$eval('div.dek', div => div.innerText);
                const url = await head.$eval('a', a => a.href);
                const headline = await head.$eval('a', a => a.innerText);
                let utiliti = await item.$('.stream-utility');
                const date = await utiliti.$eval('li.pubdate', li => li.innerText);
                //
                let author = [];
                if (authors != null) {
                    for (const autha of authors) {
                        let value = await page_news.evaluate(li => li.innerText, autha)
                        author.push(value);
                    }
                } else {
                    author.push(null)
                }


                let empty = null;
                let emptyArr = "";
                //
                let url_src = url_news;
                let vidLen = empty;
                let isVid = false;
                let catLink = empty;
                let images = emptyArr;

                add_news.push({
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
                console.log('\x1b[42m%s\x1b[0m', `From ${url_news} loop: ${error.name}`)
                continue;
            }
        }
        //
        await page_news.close();
        //
        const page_mostPopula = await browser.newPage();
        page_mostPopula.setUserAgent(vars.userAgent);
        await page_mostPopula.goto(uri_mostPopula, { waitUntil: 'networkidle2', timeout: 0 });
        await page_mostPopula.waitFor(53000);
        await page_mostPopula.waitForXPath('//*[@id="main"]/div[5]');
        await page_mostPopula.waitFor(3000);
        await page_mostPopula.click('.icon-load-more');
        await page_mostPopula.waitFor(3000);
        await page_mostPopula.click('.icon-load-more');
        await page_mostPopula.waitFor(3000);
        await page_mostPopula.click('.icon-load-more');
        await page_mostPopula.waitFor(3000);
        await page_mostPopula.click('.icon-load-more');
        await page_mostPopula.waitFor(3000);
        await page_mostPopula.click('.icon-load-more');
        const items_mostPopula = await page_mostPopula.$$('.stream-item');
        await page_mostPopula.waitFor(5000);
        //
        for (const item of items_mostPopula) {
            try {
                const thumbnail = await item.$eval('img', img => img.src);
                const head = await item.$('.hed');
                const tag = await item.$eval('a.topic', a => a.innerText);
                const category = await item.$eval('span.content-type', span => span.innerText)
                const a = await item.$('.byline-list');
                const authors = await a.$$('li');
                const lede = await item.$eval('div.dek', div => div.innerText);
                const url = await head.$eval('a', a => a.href);
                const headline = await head.$eval('a', a => a.innerText);
                let utiliti = await item.$('.stream-utility');
                const date = await utiliti.$eval('li.pubdate', li => li.innerText);
                //
                let author = [];
                let url_src = uri_mostPopula;

                for (const autha of authors) {
                    let value = await page_mostPopula.evaluate(li => li.innerText, autha)
                    author.push(value);
                }

                let empty = null;
                let emptyArr = "";
                let catLink = empty;
                let vidLen = empty;
                let isVid = false;
                //
                add_mostPopula.push({
                    src_name,
                    url,
                    url_src,
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
                console.log('\x1b[42m%s\x1b[0m', `From ${uri_mostPopula} loop: ${error.name}`)
                continue;
            }
        }
        await page_mostPopula.close();
        ///
        const page_study = await browser.newPage();
        page_study.setUserAgent(vars.userAgent);
        await page_study.goto(uri_study, { waitUntil: 'networkidle2', timeout: 0 });
        await page_study.waitForSelector('.stream-entry');
        await page_study.waitFor(3000);
        const first = page_study.$('.stream-list > .no-bullet');
        await page_study.waitFor(3000);
        await page_study.click('.icon-load-more');
        await page_study.waitFor(3000);
        await page_study.click('.icon-load-more');
        await page_study.waitFor(3000);
        await page_study.click('.icon-load-more');
        await page_study.waitFor(3000);
        await page_study.click('.icon-load-more');
        await page_study.waitFor(3000);
        await page_study.click('.icon-load-more');
        const items_study = await page_study.$$('.stream-list > .no-bullet > li');
        await page_study.waitFor(5000);
        //
        for (const item of items_study) {
            try {
                const image = await item.$('img');
                const h4 = await item.$('h4');
                const a = await item.$('.byline-list');
                const subj = await item.$('div.hide-small > p:nth-child(6)');
                const ft = await item.$('div.hide-small > p:nth-child(8)');
                const authors = (a != null || undefined) ? await a.$$('li') : null;
                let url_src = uri_study;
                //
                const thumbnail = (image != null || undefined) ? await item.$eval('img', img => img.src) : null;
                const headline = await h4.$eval('a', a => a.innerText);
                const url = await h4.$eval('a', a => a.href);
                const about = await item.$eval('p.product-text.mbs', p => p.innerText);
                let author = [];
                if (authors != null) {
                    for (const autha of authors) {
                        let value = await page_study.evaluate(li => li.innerText, autha)
                        author.push(value);
                    }
                } else {
                    author.push(null)
                }
                const date = await item.$eval('time', time => time.innerText);
                const subject = await page_study.evaluate(p => p.innerText, subj)
                const format = await page_study.evaluate(p => p.innerText, ft)

                add_study.push({
                    src_name,
                    url_src,
                    "url": url,
                    "title": title,
                    "thumbnail": thumbnail,
                    "author": all,
                    src,
                    "subject": subject,
                    "format": format,
                    "about": about,
                    "date": date,
                })

            } catch (error) {
                console.log('\x1b[42m%s\x1b[0m', `From ${uri_study} loop: ${error.name}`)
                continue;
            }
        }
        //
        await page_study.close();
        const page_video = await browser.newPage();
        page_video.setUserAgent(vars.userAgent);
        await page_video.setViewport({
            width: 1920,
            height: 1080
        });
        await page_video.goto(uri_video, { waitUntil: 'networkidle2', timeout: 0 });
        await page_video.waitFor(33000);
        await page_video.waitForSelector('.mvm');
        const items_video = await page_video.$$('.mvm.flex-row');
        //
        for (const item of items_video) {
            try {
                let url_src = uri_video;
                const headline = await item.$('.mbn');
                const wrapper = await item.$('.pubdate');
                const url = (headline != null || undefined) ? await headline.$eval('a', a => a.href) : null;
                const headlineText = (headline != null || undefined) ? await headline.$eval('a', a => a.innerText) : null;
                const thumbnail = await item.$eval('img', img => img.src);
                const vidLen = (wrapper != null || undefined) ? await item.$eval('li.text-gray', li => li.innerText) : null;
                const date = (wrapper != null || undefined) ? await item.$eval('li.pubdate', li => li.innerText) : null;
                //

                const pam = await item.$('.pam');
                const a = (pam != null || undefined) ? await pam.$eval('stream-item', a => a.dataset.authors) : null;
                const b = (pam != null || undefined) ? await pam.$eval('stream-item', b => b.dataset.summary) : null;
                const c = (pam != null || undefined) ? await pam.$eval('stream-item', c => c.dataset.topic) : null;

                let pub = a.split(";");

                let credit = (pub == "") ? null : pub;


                add_video.push({
                    url_src,
                    src_name,
                    "url": url,
                    "headline": headlineText,
                    "lede": b,
                    src,
                    "thumbnail": thumbnail,
                    "author": credit,
                    "category": c,
                    "vidLen": vidLen,
                    "date": date
                })

            } catch (error) {
                console.log('\x1b[42m%s\x1b[0m', `From ${uri_video} loop: ${error.name}`)
                continue;
            }
        }
        console.log('\x1b[43m%s\x1b[0m', `Done: ${uri_video}`);
        await page_video.close();
    } catch (error) {
        console.log('\x1b[41m%s\x1b[0m', `From ${uri_video} Main: ${error}`);
    }
}
let source_news = "https://hbr.org/";
let source_mostPopula = "https://hbr.org/most-popular";
let source_study = "https://hbr.org/visual-library";
let source_video = "https://hbr.org/video";
//
cron.schedule("0 4 * * SUN", () => {
    (() => {
        console.log('\x1b[46m%s\x1b[0m', "HBR fired at:" + Date());
        //
        main(source_news, source_mostPopula, source_study, source_video);

    })();
});
//
Routa.get('/hbr', (req, res) => {
    res.send({
        "news": add_news,
        "most popular": add_mostPopula,
        "research": add_study,
        "video": add_video
    });
});
module.exports = Routa;
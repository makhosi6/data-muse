const express = require('express');
require('dotenv').config()
const hbr = express.Router();
const puppeteer = require('puppeteer');
process.setMaxListeners(Infinity);
let vars = require('./store/storeVars');

// 
//
let add_news = [];
let add_mostPopula = [];
let add_study = [];
let add_video = [];
async function main(url_news, uri_mostPopula, uri_study, uri_video) {
    try {
        const browser = await puppeteer.launch({
            args: vars.argsArr,
            defaultViewport: null,
            headless: vars.bool,
            executablePath: vars.exPath
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
                const headline = await item.$('.hed');
                const topic = await item.$eval('a.topic', a => a.innerText);
                const category = await item.$eval('span.content-type', span => span.innerText)
                const a = await item.$('.byline-list');
                const authors = (a != null || undefined) ? await a.$$('li') : null;
                const lede = await item.$eval('div.dek', div => div.innerText);
                const url = await headline.$eval('a', a => a.href);
                const headlineText = await headline.$eval('a', a => a.innerText);
                let utiliti = await item.$('.stream-utility');
                const date = await utiliti.$eval('li.pubdate', li => li.innerText);
                //
                let all = [];
                if (authors != null) {
                    for (const author of authors) {
                        let value = await page_news.evaluate(li => li.innerText, author)
                        all.push(value);
                    }
                } else {
                    all.push(null)
                }

                add_news.push({
                    "url": url,
                    "lede": lede,
                    "headline": headlineText,
                    "thumbnail": thumbnail,
                    "author": all,
                    "category": category,
                    "tag": topic,
                    "date": date,
                })

            } catch (error) {
                console.trace('\x1b[42m%s\x1b[0m', `From ${url_news} loop: ${error}`);
                continue;
            }
        }
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
                const headline = await item.$('.hed');
                const topic = await item.$eval('a.topic', a => a.innerText);
                const category = await item.$eval('span.content-type', span => span.innerText)
                const a = await item.$('.byline-list');
                const authors = await a.$$('li');
                const lede = await item.$eval('div.dek', div => div.innerText);
                const url = await headline.$eval('a', a => a.href);
                const headlineText = await headline.$eval('a', a => a.innerText);
                let utiliti = await item.$('.stream-utility');
                const date = await utiliti.$eval('li.pubdate', li => li.innerText);
                //
                let all = [];

                for (const author of authors) {
                    let value = await page_mostPopula.evaluate(li => li.innerText, author)
                    all.push(value);
                }

                add_mostPopula.push({
                    "url": url,
                    "lede": lede,
                    "headline": headlineText,
                    "thumbnail": thumbnail,
                    "author": all,
                    "category": category,
                    "tag": topic,
                    "date": date
                })

            } catch (error) {
                console.trace('\x1b[42m%s\x1b[0m', `From ${uri_mostPopula} loop: ${error}`);
                continue;
            }
        }

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

                //
                const thumbnail = (image != null || undefined) ? await item.$eval('img', img => img.src) : null;
                const title = await h4.$eval('a', a => a.innerText);
                const url = await h4.$eval('a', a => a.href);
                const about = await item.$eval('p.product-text.mbs', p => p.innerText);
                let all = [];
                if (authors != null) {
                    for (const author of authors) {
                        let value = await page_study.evaluate(li => li.innerText, author)
                        all.push(value);
                    }
                } else {
                    all.push(null)
                }
                const date = await item.$eval('time', time => time.innerText);
                const subject = await page_study.evaluate(p => p.innerText, subj)
                const format = await page_study.evaluate(p => p.innerText, ft)

                add_study.push({
                    "url": url,
                    "title": title,
                    "thumbnail": thumbnail,
                    "author": all,
                    "subject": subject,
                    "format": format,
                    "about": about,
                    "date": date,
                })

            } catch (error) {
                console.trace('\x1b[42m%s\x1b[0m', `From ${uri_study} loop: ${error}`);
                continue;
            }
        }
        //

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
                    "url": url,
                    "headline": headlineText,
                    "lede": b,
                    "thumbnail": thumbnail,
                    "author": credit,
                    "category": c,
                    "vidLen": vidLen,
                    "date": date
                })

            } catch (error) {
                console.trace('\x1b[42m%s\x1b[0m', `From ${uri_video} loop: ${error}`);
                continue;
            }
        }
        console.log('\x1b[43m%s\x1b[0m', `Done: ${uri_video}`);
        browser.close();
    } catch (error) {
        console.trace('\x1b[41m%s\x1b[0m', `From ${uri_video} Main: ${error}`);
    }

}


let source_news = "https://hbr.org/";
let source_mostPopula = "https://hbr.org/most-popular";
let source_study = "https://hbr.org/visual-library";
let source_video = "https://hbr.org/video";
//
main(source_news, source_mostPopula, source_study, source_video);
//
hbr.get('/hbr-all', (req, res) => {
    res.send({
        "HBR": add_news,
        "HBRmostPopula": add_mostPopula,
        "HBRStudy": add_study,
        "HBRVideo": add_video
    });
})

module.exports = hbr;
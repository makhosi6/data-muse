const express = require('express');
require('dotenv').config()
const aljRouta = express.Router();
const puppeteer = require('puppeteer');
const vars = require('./store/storeVars');
const wsChromeEndpointurl = require('../browser');
const puppet = require('./store/puppetAlj');

//
process.setMaxListeners(Infinity);
///
let add_docs = [];
let add_trending = [];

async function main(uri_docs, uri_trending) {
    try {
        const browser = await puppeteer.connect({
            browserWSEndpoint: wsChromeEndpointurl,
        });
        const page_docs = await browser.newPage();
        page_docs.setUserAgent(vars.userAgent);
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
                console.trace('\x1b[42m%s\x1b[0m', `From ${uri_docs} loop: ${error}`);
                continue;
            }
            // page
        }
        //
        await page_docs.close();
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
                console.trace('\x1b[42m%s\x1b[0m', `From ${uri_trending} loop: ${error}`);
                continue;
            }

        }
        //
        await page_trending.close();
        console.log('\x1b[43m%s\x1b[0m', `Done: ${uri_trending}`);

    } catch (error) {
        console.trace('\x1b[41m%s\x1b[0m', `From ${uri_trending} Main: ${error}`);
    }
}

let source = {
        docs: "https://www.aljazeera.com/documentaries/",
        africa: "https://www.aljazeera.com/topics/regions/africa.html",
        trending: "https://www.aljazeera.com/",
        news: "https://www.aljazeera.com/topics/regions/africa.html",
    }
    //

const Puppet = puppet.Scrapper;
//
const dataAfrica = new Puppet(source.africa);
dataAfrica.puppet();
//
const dataNews = new Puppet(source.news);
dataNews.puppet();

//
main(source.docs, source.trending);
/////////////
aljRouta.get('/alj', (req, res) => {
    res.send({
        "aljDocs": add_docs,
        "aljAfrica": dataAfrica,
        "aljNews": dataNews,
        "aljTrending": add_trending
    });
})
module.exports = aljRouta;
require('dotenv').config()
const puppeteer = require('puppeteer');
const cron = require("node-cron");
const vars = require('../store/storeVars');
const wsChromeEndpointurl = require('../browser');
const puppet = require('../store/puppetAlj');

//
process.setMaxListeners(Infinity);
///
let add_docs = [];
let add_trending = [];
//
let empty = null;
let emptyArr = [];

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
                const tagg = await item.$('h4.heading-section');
                const anchor = await item.$('a.play');
                //
                const tagText = await tagg.$eval('a', a => a.innerText);
                const catLink = await tagg.$eval('a', a => a.href);
                const url = await page_docs.evaluate(a => a.href, anchor);
                const lede = await item.$eval('p', p => p.innerText);
                const thumbnail = await item.$eval('img', img => img.src);
                const headline = await item.$eval('img', img => img.title);
                let tag = tagText.replace(/ /g, "_");
                //

                //

                let category = (tagText === null) ? "documentary" : tagText;
                let images = emptyArr;
                let isVid = true;
                let src = "https://www.aljazeera.com/assets/images/AljazeeraLogo.png";
                let author = empty;
                let date = empty;

                let url_src = uri_docs;
                //
                add_docs.push({
                    url_src,
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
                    //
                    author,
                    date
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
                const catText = await el.$('h4.heading-section');
                const catLink = await catText.$eval('a', a => a.href);
                const anchor = await el.$('a.play');
                const para = await el.$('p');
                const tags = await el.$$('p.meta > a');
                //
                let tag = [];
                for (const tagg of tags) {
                    const tagText2 = await page_docs.evaluate(a => a.innerText, tagg);
                    let txt = tagText2.replace(/ /g, "_");
                    tag.push(txt);
                }
                const a = await catText.$eval('a', a => a.innerText);
                const url = await page_docs.evaluate(a => a.href, anchor);
                const lede = await page_docs.evaluate(p => p.innerText, para);
                const thumbnail = await el.$eval('img', img => img.src);
                const headline = await el.$eval('img', img => img.title);

                let end = category.replace(/ /g, "_");
                let category = (a === null) ? "documentary" : a;
                tag.push(end);
                let images = emptyArr;
                let isVid = true;
                let author = empty;
                let src = "https://www.aljazeera.com/assets/images/AljazeeraLogo.png";
                let date = empty;
                let url_src = uri_docs;

                add_docs.push({
                    url_src,
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
                    //
                    author,
                    date
                })
            } catch (error) {
                console.log('\x1b[42m%s\x1b[0m', `From ${uri_docs} loop: ${error.name}`)
            }
        }
        //LOOP three 
        const comps_docs = await page_docs.$$('#shows-catchup > article.item.blurb');
        //

        for (const comp of comps_docs) {

            try {
                const tagg = await comp.$('h4.heading-section');
                const anchor = await comp.$('a.play');
                //
                const tagText = await tagg.$eval('a', a => a.innerText);
                const catLink = await tagg.$eval('a', a => a.href);
                const url = await page_docs.evaluate(a => a.href, anchor);
                const lede = await comp.$eval('p', p => p.innerText);
                const thumbnail = await comp.$eval('img', img => img.src);
                const headline = await comp.$eval('img', img => img.title);
                let tag = tagText.replace(/ /g, "_");
                //
                l
                //
                let category = (tagText === null) ? "documentary" : tagText;
                let images = emptyArr;
                let isVid = true;
                let src = "https://www.aljazeera.com/assets/images/AljazeeraLogo.png";
                let author = empty;
                let date = empty;

                let url_src = uri_docs;
                //
                add_docs.push({
                    url_src,
                    src,
                    url,
                    headline,
                    lede,
                    thumbnail,
                    //
                    category,
                    catLink,
                    tag,
                    //
                    images,
                    //
                    isVid,
                    //
                    author,
                    date
                })
            } catch (error) {
                console.log('\x1b[42m%s\x1b[0m', `From ${uri_docs} loop: ${error.name}`)
                continue;
            }
            // page
        }
        //
        await page_docs.close();
        //

        const page_trending = await browser.newPage();
        page_trending.setUserAgent(vars.userAgent);
        await page_trending.goto(uri_trending, { waitUntil: 'networkidle2', timeout: 0 });
        await page_trending.waitForSelector('.latest-news-topic-trending');
        const items_trending = await page_trending.$$('#trending-widget > .latest-news-topic-trending');

        await page_trending.waitFor(5000);
        //
        for (const item of items_trending) {
            try {
                const head = await item.$('.news-trending-txt');
                //
                const url = (head != null || undefined) ? await head.$eval('a', a => a.href) : null;
                const headline = await head.$eval('p', p => p.innerText);
                let src = "https://www.aljazeera.com/assets/images/AljazeeraLogo.png";
                add_trending.push({
                    src,
                    url,
                    headline
                })
            } catch (error) {
                console.log('\x1b[42m%s\x1b[0m', `From ${uri_trending} loop: ${error.name}`)
                continue;
            }

        }
        //
        await page_trending.close();
        console.log('\x1b[43m%s\x1b[0m', `Done: ${uri_trending}`);

    } catch (error) {
        console.log('\x1b[41m%s\x1b[0m', `From ${uri_trending} Main: ${error}`);
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
const dataNews = new Puppet(source.news);

//
cron.schedule("0 */6 * * *", () => {

    (() => {
        console.log('\x1b[46m%s\x1b[0m', "ALJ fired at:" + Date());
        dataAfrica.puppet();
        dataNews.puppet();
        main(source.docs, source.trending);
    })();
});

module.exports = {
    "documentaries": add_docs,
    "africa": dataAfrica.data,
    "news": dataNews.data,
    "trending": add_trending
};
const express = require('express');
const menLifestyle = express.Router();
const puppeteer = require('puppeteer');
require('dotenv').config();
const scrollPageToBottom = require('puppeteer-autoscroll-down');
const vars = require('./store/storeVars');

///
process.setMaxListeners(Infinity);
//
let add_men = [];
let add_women = [];
let add_vogue = [];
let add_you = [];
async function main(uri_men, uri_women, uri_vogue, uri_you) {

    try {
        const browser = await puppeteer.launch({
            args: vars.argsArr,
            defaultViewport: null,
            headless: vars.bool,
            executablePath: vars.exPath
        });

        const page_men = await browser.newPage();
        page_men.setUserAgent(vars.userAgent);

        await page_men.goto(uri_men, { waitUntil: 'networkidle2', timeout: 0 });

        await page_men.waitForSelector('article.post');
        //

        let myVar = setInterval(() =>
            scrollPageToBottom(page_men), 100);
        //
        await page_men.waitFor(5300);
        clearInterval(myVar);

        await page_men.waitFor(32300);
        ///
        const items_men = await page_men.$$('article.post');
        //
        for (const item of items_men) {
            try {
                const get = await item.$('div.uk-cover-background.uk-position-cover');
                const cat = await item.$('.uk-badge');
                //
                const link = await item.$eval('.uk-panel-title', a => a.href);
                const headline = await item.$eval('.uk-panel-title', a => a.innerText);
                const category = (cat != null || undefined) ? await page_men.evaluate(a => a.innerText, cat) : null;
                const thumbnail = await page_men.evaluate(div => div.style.backgroundImage, get);
                //
                let a = thumbnail.split('url("');
                let b = a[1];
                let c = b.split('")');
                let d = c[0];
                const iHtml = await page_men.evaluate(el => el.innerHTML, cat);

                add_men.push({

                    "category": category,
                    "url": link,
                    "thumbnail": d,
                    "headline": headline,
                })
            } catch (error) {
                console.trace('\x1b[42m%s\x1b[0m', `From ${uri_men} loop: ${error.name}`);
                continue;
            }
        }
        // 


        const page_women = await browser.newPage();
        page_women.setUserAgent(vars.userAgent);

        await page_women.goto(uri_women, { waitUntil: 'networkidle2', timeout: 0 });

        await page_women.waitForSelector('article.post');
        //
        let myVar_women = setInterval(() =>
            scrollPageToBottom(page_women), 100);
        //
        await page_women.waitFor(5300);
        clearInterval(myVar_women);
        await page_women.waitFor(32300);
        ///
        const items_women = await page_women.$$('article.post');
        //
        for (const item of items_women) {
            try {
                //
                const get = await item.$('div.uk-cover-background.uk-position-cover');
                const cat = await item.$('.uk-badge');
                //
                const link = await item.$eval('.uk-panel-title', a => a.href);
                const headline = await item.$eval('.uk-panel-title', a => a.innerText);
                const category = (cat != null || undefined) ? await page_women.evaluate(a => a.innerText, cat) : null;
                const thumbnail = await page_women.evaluate(div => div.style.backgroundImage, get);
                //
                let a = thumbnail.split('url("');
                let b = a[1];
                let c = b.split('")');
                let d = c[0];
                const iHtml = await page_women.evaluate(el => el.innerHTML, cat);

                add_women.push({
                    "category": category,
                    "url": link,
                    "thumbnail": d,
                    "headline": headline,
                })
            } catch (error) {
                console.trace('\x1b[42m%s\x1b[0m', `From ${uri_women} loop: ${error.name}`);
                continue;
            }
        }


        // 
        const page_vogue = await browser.newPage();
        page_vogue.setUserAgent(vars.userAgent);
        await page_vogue.goto(uri_vogue, { waitUntil: 'networkidle2', timeout: 0 });
        await page_vogue.waitForSelector('[data-test-id="TeaserBasic"]');
        //
        const items_vogue = await page_vogue.$$('[data-test-id="TeaserBasic"]');
        await page_vogue.waitFor(125000);
        ////
        for (const item of items_vogue) {
            try {
                const anchor = await item.$('[data-test-id="Anchor"]');
                const image = await item.$('[data-test-id="Img"]');
                const imageTwo = await item.$('noscript');
                const head = await item.$('[data-test-id="Hed"]');
                const name = await item.$('[data-test-id="Name"]');
                const cat = await item.$('[data-test-id="KickerText"]');
                //

                const thumbnail = (image != null || undefined) ? await page_vogue.evaluate(img => img.src, image) : await page_vogue.evaluate(img => img.innerHTML, imageTwo);
                const link = (anchor != null || undefined) ? await page_vogue.evaluate(a => a.href, anchor) : null;
                const headline = (head != null || undefined) ? await page_vogue.evaluate(p => p.innerText, head) : null;
                const category = (cat != null || undefined) ? await page_vogue.evaluate(p => p.innerText, cat) : null;
                const author = (name != null || undefined) ? await page_vogue.evaluate(p => p.innerText, name) : null;
                //

                let a = (image == null) ? thumbnail.split('src="') : null;
                let b = (image == null) ? a[1] : null;
                let c = (image == null) ? b.split('" srcSet="') : null;
                let d = (image == null) ? c[0] : null;
                let e = (d == null) ? thumbnail : d;
                //
                add_vogue.push({
                        "author": author,
                        "category": category,
                        "url": link,
                        "thumbnail": e,
                        "headline": headline
                    })
                    //
            } catch (error) {
                console.trace('\x1b[42m%s\x1b[0m', `From ${uri_vogue} loop: ${error.name}`);
                continue;
            }
        }
        // 
        const page_you = await browser.newPage();
        page_you.setUserAgent(vars.userAgent);
        await page_you.goto(uri_you, { waitUntil: 'networkidle2', timeout: 0 });
        await page_you.waitForSelector('#load_more');
        await page_you.click('#load_more');
        await page_you.waitFor(33000);
        await page_you.click('#load_more');
        await page_you.waitFor(33000);
        await page_you.click('#load_more');
        await page_you.waitFor(33000);
        await page_you.click('#load_more');
        await page_you.waitFor(33000);
        await page_you.click('#load_more');

        //
        const items_you = await page_you.$$('.article_item');
        await page_you.waitFor(125000);
        //
        for (const item of items_you) {
            try {
                //
                const image = await item.$('#lnkListingImage > img');
                const title = await item.$('h3 > a#lnkListingTitle');
                //
                const link = await item.$eval('a#lnkListingTitle', a => a.href);
                const thumbnail = await page_you.evaluate(img => img.src, image);
                const lede = await item.$eval('p', p => p.innerText);
                const headline = await page_you.evaluate(a => a.innerText, title);
                //
                add_you.push({
                    "lede": lede,
                    "url": link,
                    "thumbnail": thumbnail,
                    "headline": headline,
                })
            } catch (error) {
                console.trace('\x1b[42m%s\x1b[0m', `From ${uri_you} loop: ${error.name}`);
                continue;
            }

        }
        //

        console.log('\x1b[43m%s\x1b[0m', `Done: ${uri_you}`);
        browser.close();
    } catch (error) {
        console.trace('\x1b[41m%s\x1b[0m', `From ${uri_you} Main: ${error.name}`);
    }
}
let source_men = "https://www.mh.co.za/";
let source_women = "https://www.womenshealthsa.co.za/";
let source_vogue = "https://www.vogue.co.uk/";
let source_you = "https://www.news24.com/You";
//
main(source_men, source_women, source_vogue, source_you);
/////
menLifestyle.get('/magz-lifestyle', (req, res) => {
    res.send({

        "menLifestyle": add_men,
        "womenLifestyle": add_women,
        "vogue": add_vogue,
        "you": add_you
    });
})

module.exports = menLifestyle;
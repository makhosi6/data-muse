const wsChromeEndpointurl = require('../browser');
const puppeteer = require('puppeteer');
const cron = require("node-cron");
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
        const browser = await puppeteer.connect({
            browserWSEndpoint: wsChromeEndpointurl,
            defaultViewport: null
        });
        const page_men = await browser.newPage();
        page_men.setUserAgent(vars.userAgent);
        await page_men.goto(uri_men, { waitUntil: 'networkidle2', timeout: 0 });
        await page_men.waitForSelector('article.post');
        let myVar = setInterval(() =>
            scrollPageToBottom(page_men), 100);
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
                const url = await item.$eval('.uk-panel-title', a => a.href);
                const headline = await item.$eval('.uk-panel-title', a => a.innerText);
                const category = (cat != null || undefined) ? await page_men.evaluate(a => a.innerText, cat) : null;
                const thumb = await page_men.evaluate(div => div.style.backgroundImage, get);
                //
                let a = thumb.split('url("');
                let b = a[1];
                let c = b.split('")');
                let thumbnail = c[0];
                const iHtml = await page_men.evaluate(el => el.innerHTML, cat);
                //
                let empty = null;
                let emptyArr = "";
                let src = "https://upload.wikimedia.org/wikipedia/commons/8/8b/Men%27s_Health.svg";
                //
                let catLink = empty;
                let tag = empty;
                //
                let images = emptyArr;
                //
                let isVid = false;
                let vidLen = empty;
                //
                let author = empty;
                let date = empty;
                let lede = empty;

                add_men.push({
                    url,
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
                console.log('\x1b[42m%s\x1b[0m', `From ${uri_men} loop: ${error.name}`)
                continue;
            }
        }
        // 

        const page_women = await browser.newPage();
        page_women.setUserAgent(vars.userAgent);
        await page_women.goto(uri_women, { waitUntil: 'networkidle2', timeout: 0 });
        await page_women.waitForSelector('article.post');
        let myVar_women = setInterval(() =>
            scrollPageToBottom(page_women), 100);
        await page_women.waitFor(5300);
        clearInterval(myVar_women);
        await page_women.waitFor(32300);
        const items_women = await page_women.$$('article.post');
        for (const item of items_women) {
            try {
                //
                const get = await item.$('div.uk-cover-background.uk-position-cover');
                const cat = await item.$('.uk-badge');
                //
                const url = await item.$eval('.uk-panel-title', a => a.href);
                const headline = await item.$eval('.uk-panel-title', a => a.innerText);
                const category = (cat != null || undefined) ? await page_women.evaluate(a => a.innerText, cat) : null;
                const thumb = await page_women.evaluate(div => div.style.backgroundImage, get);
                //
                let a = thumb.split('url("');
                let b = a[1];
                let c = b.split('")');
                let thumbnail = c[0];
                const iHtml = await page_women.evaluate(el => el.innerHTML, cat);
                let empty = null;
                let emptyArr = "";
                let src = "https://www.womenshealthsa.co.za/wp-content/uploads/2018/01/wh-logo.svg";
                //
                let catLink = empty;
                let tag = empty;
                //
                let images = emptyArr;
                //
                let isVid = false;
                let vidLen = empty;
                //
                let author = empty;
                let date = empty;
                let lede = empty;
                add_women.push({
                    url,
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
                console.log('\x1b[42m%s\x1b[0m', `From ${uri_women} loop: ${error.name}`)
                continue;
            }
        }


        // 
        const page_vogue = await browser.newPage();
        page_vogue.setUserAgent(vars.userAgent);
        await page_vogue.goto(uri_vogue, { waitUntil: 'networkidle2', timeout: 0 });
        await page_vogue.waitForSelector('[data-test-id="TeaserBasic"]');
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

                const thumb = (image != null || undefined) ? await page_vogue.evaluate(img => img.src, image) : await page_vogue.evaluate(img => img.innerHTML, imageTwo);
                const url = (anchor != null || undefined) ? await page_vogue.evaluate(a => a.href, anchor) : null;
                const headline = (head != null || undefined) ? await page_vogue.evaluate(p => p.innerText, head) : null;
                const category = (cat != null || undefined) ? await page_vogue.evaluate(p => p.innerText, cat) : null;
                const author = (name != null || undefined) ? await page_vogue.evaluate(p => p.innerText, name) : null;
                //

                let a = (image == null) ? thumb.split('src="') : null;
                let b = (image == null) ? a[1] : null;
                let c = (image == null) ? b.split('" srcSet="') : null;
                let d = (image == null) ? c[0] : null;
                let thumbnail = (d == null) ? thumb : d;
                //
                let empty = null;
                let emptyArr = "";
                let src = "https://img.favpng.com/24/11/2/vogue-logo-magazine-fashion-png-favpng-H83cmbUdKYE8XPb1rZtiVg4j8.jpg";
                //
                let date = empty;
                let catLink = empty;
                let tag = category;
                //
                let images = emptyArr;
                //
                let isVid = false;
                let vidLen = empty;

                let lede = empty;
                add_vogue.push({
                        url,
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
                    //
            } catch (error) {
                console.log('\x1b[42m%s\x1b[0m', `From ${uri_vogue} loop: ${error.name}`)
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
                const url = await item.$eval('a#lnkListingTitle', a => a.href);
                const thumbnail = await page_you.evaluate(img => img.src, image);
                const lede = await item.$eval('p', p => p.innerText);
                const headline = await page_you.evaluate(a => a.innerText, title);
                //
                let empty = null;
                let emptyArr = "";
                let src = "https://pbs.twimg.com/profile_images/463234912493907968/HxL6FPIG_400x400.jpeg";
                //
                let date = empty;
                let author = empty;
                let category = empty;
                let catLink = empty;
                let tag = category;
                //
                let images = emptyArr;
                //
                let isVid = false;
                let vidLen = empty;

                //
                add_you.push({
                    url,
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
                console.log('\x1b[42m%s\x1b[0m', `From ${uri_you} loop: ${error.name}`)
                continue;
            }

        }
        //

        console.log('\x1b[43m%s\x1b[0m', `Done: ${uri_you}`);
        //
        await page_men.close();
        await page_women.close();
        await page_you.close();
        await page_vogue.close();

        //
    } catch (error) {
        console.log('\x1b[41m%s\x1b[0m', `From ${uri_you} Main: ${error}`);
    }
}
let source_men = "https://www.mh.co.za/";
let source_women = "https://www.womenshealthsa.co.za/";
let source_vogue = "https://www.vogue.co.uk/";
let source_you = "https://www.news24.com/You";
///
cron.schedule("0 4 * * SUN", () => {
    (() => {
        console.log('\x1b[46m%s\x1b[0m', "MAGZ fired at:" + Date());
        //
        main(source_men, source_women, source_vogue, source_you);

    })();
});
//
module.exports = {
    "men lifestyle": add_men,
    "women lifestyle": add_women,
    "vogue": add_vogue,
    "you": add_you
};
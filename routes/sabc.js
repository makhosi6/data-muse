const express = require('express');
const sabcBusiness = express.Router();
const puppeteer = require('puppeteer');
const puppet = require('./store/puppetSabc');
require('dotenv').config();
const vars = require('./store/storeVars');
///
process.setMaxListeners(Infinity);
//
let add = [];

async function main(uri) {

    try {

        const browser = await puppeteer.launch({
            args: vars.argsArr,
            defaultViewport: null,
            headless: vars.bool,
            executablePath: vars.exPath
        });
        // 
        const page = await browser.newPage();
        page.setUserAgent(vars.userAgent);
        await page.goto(uri, { waitUntil: 'networkidle2', timeout: 0 });
        await page.waitForSelector('.ppc');
        const items = await page.$$('.ppc');
        await page.waitFor(125000);
        //
        for (const item of items) {
            try {
                // const left = await item.$('.right > .content > .article-synopsis.d-none.d-md-block');
                const cat = await item.$('.home_page_category > a');
                const image = await item.$('.category-image > img');
                const title = await item.$('.category-title > a');

                //
                const thumbnail = await page.evaluate(img => img.src, image);
                const date = await item.$eval('p.ppc-first-post-date', p => p.innerText);
                const lede = await item.$eval('p.ppc-first-post-excerpt', p => p.innerText);
                const category = await page.evaluate(a => a.innerText, cat);
                const link = await page.evaluate(a => a.href, title);
                const headline = await page.evaluate(a => a.innerText, title);
                //

                const iHtml = await page.evaluate(el => el.innerHTML, item);

                add.push({
                    "date": date,
                    "lede": lede,
                    "category": category,
                    "url": link,
                    "thumbnail": thumbnail,
                    "headline": headline,
                })
            } catch (error) {
                console.trace('\x1b[42m%s\x1b[0m', `From ${uri} loop: ${error}`);
                continue;
            }
        }
        console.log('\x1b[43m%s\x1b[0m', `Done: ${uri}`);
        browser.close();
    } catch (error) {
        console.trace('\x1b[41m%s\x1b[0m', `From ${uri} Main: ${error}`);
    }
}
let sources = {
        business: "https://www.sabcnews.com/sabcnews/category/business/",
        politics: "https://www.sabcnews.com/sabcnews/category/politics/",
        science: "https://www.sabcnews.com/sabcnews/category/sci-tech/",
        sport: "https://www.sabcnews.com/sabcnews/category/sport/",
        world: "https://www.sabcnews.com/sabcnews/category/world/",
        news: "https://www.sabcnews.com/sabcnews/"
    }
    //source_business, , source_politics, source_science, source_sport, source_world

main(sources.news)
    //
const Puppet = puppet.Scrapper;
//one
const dataOne = new Puppet(sources.politics);
dataOne.puppet();
//Two
const dataTwo = new Puppet(sources.business);
dataTwo.puppet();
//tthree
const dataThree = new Puppet(sources.science);
dataThree.puppet();
//four
const dataFour = new Puppet(sources.sport);
dataFour.puppet();
//five
const dataFive = new Puppet(sources.world);
dataFive.puppet();
/////
sabcBusiness.get('/sabc', (req, res) => {
    res.send({
        "sabcNews": add,
        "sabcBusiness": dataTwo,
        "sabcPolitics": dataOne,
        "sabcScience": dataThree,
        "sabcSport": dataFour,
        "sabcWorld": dataFive
    });
})

module.exports = sabcBusiness;
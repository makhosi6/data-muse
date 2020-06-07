const express = require('express');
const puppeteer = require('puppeteer');
const vars = require('./storeVars');
//
class Scrapper {
    constructor(uri) {
        this.uri = uri;
        this.data = [];
        this.puppet = async function() {
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
                await page.goto(this.uri, { waitUntil: 'networkidle2', timeout: 0 });
                await page.waitForSelector('.sabc_cat_list_item');
                const items = await page.$$('.sabc_cat_list_item');
                await page.waitFor(125000);
                //
                for (const item of items) {
                    try {

                        const image = await item.$('.sabc_cat_list_item_image > img');
                        const title = await item.$('.sabc_cat_list_item_title > a');

                        //sabc_cat_item_date
                        const thumbnail = await page.evaluate(img => img.src, image);
                        const date = await item.$eval('.sabc_cat_item_date', span => span.innerText);
                        const lede = await item.$eval('.sabc_cat_list_item_summary', p => p.innerText);
                        const link = await page.evaluate(a => a.href, title);
                        const headline = await page.evaluate(a => a.innerText, title);
                        //
                        const iHtml = await page.evaluate(el => el.innerHTML, item);

                        add.push({
                            "date": date,
                            "lede": lede,
                            "url": link,
                            "thumbnail": thumbnail,
                            "headline": headline,
                        })
                    } catch (error) {
                        console.trace('\x1b[42m%s\x1b[0m', `From ${this.uri} loop: ${error}`);
                        continue;
                    }
                }
                //
                this.data = arrr;
                console.log('\x1b[43m%s\x1b[0m', `Done: ${this.uri}`);
                browser.close();
            } catch (error) {
                console.trace('\x1b[41m%s\x1b[0m', `From ${this.uri} Main: ${error}`);
            }

            return this.data
        }
    }
}

module.exports = {
    Scrapper: Scrapper
};
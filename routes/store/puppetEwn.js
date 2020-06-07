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
                await page.waitForSelector('.article-short');
                const items = await page.$$('.article-short');
                await page.waitFor(5000);
                let arrr = [];
                for (const item of items) {
                    try {
                        const check = await item.$('.thumb');
                        const left = await item.$('.left');
                        if ((check == null) && (left == null)) {

                            const headline = await item.$('h4');
                            const image = await item.$('img');
                            const thumbnail = (image != null || undefined) ? await item.$eval('img', img => img.src) : null;
                            const url = await headline.$eval('a', a => a.href);
                            //
                            const headlineText = await headline.$eval('a', a => a.innerText);
                            //
                            const para = await item.$('p.lead');
                            const lede = (para != null || undefined) ? await item.$eval('p', p => p.innerText) : null;
                            const date = await item.$eval('abbr', abbr => abbr.innerText);

                            add.push({
                                "url": url,
                                "lede": lede,
                                "headline": headlineText,
                                "thumbnail": thumbnail,
                                "date": date
                            })
                        }

                    } catch (error) {
                        console.trace('\x1b[42m%s\x1b[0m', `From ${this.uri} loop: ${error.name}`);
                        continue;
                    }

                }
                //
                this.data = arrr;
                console.log('\x1b[43m%s\x1b[0m', `Done: ${this.uri}`);
                browser.close();
            } catch (error) {
                console.trace('\x1b[41m%s\x1b[0m', `From ${this.uri} Main: ${error.name}`);
            }

            return this.data
        }
    }
}

module.exports = {
    Scrapper: Scrapper
};
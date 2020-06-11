const express = require('express');
const puppeteer = require('puppeteer');
const vars = require('./storeVars');
const wsChromeEndpointurl = require('../../browser');
//
class Scrapper {
    constructor(uri) {
        this._uri = uri;
        this.data = [];
        this.puppet = async function() {
            try {
                const browser = await puppeteer.connect({
                    browserWSEndpoint: wsChromeEndpointurl,
                    defaultViewport: null
                });
                const page = await browser.newPage();
                page.setUserAgent(vars.userAgent);
                await page.goto(this._uri, { waitUntil: 'networkidle2', timeout: 0 });
                await page.waitForSelector('.cd__wrapper');
                const items = await page.$$('.cd__wrapper');
                //
                let arrr = [];
                await page.waitFor(5000);
                for (const item of items) {
                    try {
                        const sub = await item.$('.cd__content');
                        // CATEGORY
                        const subText = await sub.$eval('h3', h3 => h3.dataset.analytics);
                        const str = await subText.split("_");
                        const first = await str[0];
                        const sec = await str[2];
                        const category = (first != "") ? await first : null;
                        const hasVid = (sec == "video") ? true : false;
                        //VALUES
                        const headline = await item.$('.cd__headline');
                        const media = await item.$('.media');
                        //
                        const headlineText = await headline.$eval('span', span => span.innerText);
                        const link = await headline.$eval('a', a => a.href);
                        const mediaLink = (media != null || undefined) ? await media.$eval('a', a => a.href) : null;
                        const image = (media != null || undefined) ? await media.$('.media__image') : null;
                        const thumbnail = ((media != null || undefined) && (image != null || undefined)) ? await media.$eval('img', img => img.dataset.src) : null;

                        arrr.push({
                            "category": category,
                            "url": link,
                            "has video": hasVid,
                            "media url": mediaLink,
                            "thumbnail": thumbnail,
                            "headline": headlineText
                        })


                    } catch (error) {
                        console.trace('\x1b[42m%s\x1b[0m', `From ${this._uri} loop: ${error}`);
                    }
                }
                this.data = arrr;
                await page.close()
                console.log('\x1b[43m%s\x1b[0m', `Done: ${this._uri}`);

            } catch (error) {
                console.trace('\x1b[41m%s\x1b[0m', `From ${this._uri} Main: ${error}`);
            }

            return this.data
        }
    }
}

module.exports = {
    Scrapper: Scrapper
};
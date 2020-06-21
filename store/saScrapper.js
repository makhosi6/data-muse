const express = require('express');
const puppeteer = require('puppeteer');
const vars = require('./storeVars');
const wsChromeEndpointurl = require('../browser');
//
class Scrapper {
    constructor(uri) {
        this.uri = uri;
        this.data = [];
        this.puppet = async function() {
            try {
                const browser = await puppeteer.connect({
                    browserWSEndpoint: wsChromeEndpointurl,
                    defaultViewport: null
                });
                const page = await browser.newPage();
                page.setUserAgent(vars.userAgent);
                await page.goto(uri, { waitUntil: 'networkidle2', timeout: 0 });
                await page.waitForSelector('.jeg_post');
                const items = await page.$$('.jeg_posts > .jeg_post');
                // 
                let arrr = [];
                for (const item of items) {
                    try {
                        const iHtml = await page.evaluate(el => el.innerHTML, item);
                        //
                        const head = await item.$('h3.jeg_post_title');
                        const time = await item.$('.jeg_meta_date');
                        const publisher = await item.$('.jeg_meta_author');
                        const cat = await item.$('.jeg_post_category');
                        const catB = await item.$('.jeg_post_category a');
                        const wrapper = await item.$('.jeg_thumb');
                        //
                        const url = (head != null || undefined) ? await head.$eval('a', a => a.href) : null;
                        const headline = (head != null || undefined) ? await head.$eval('a', a => a.innerText) : null;
                        const thumbnail = (wrapper != null || undefined) ? await item.$eval('img', img => img.dataset.src) : null;
                        const lede = (item != null || undefined) ? await item.$eval('p', p => p.innerText) : null;
                        const author = (publisher != null || undefined) ? await publisher.$eval('a', a => a.innerText) : null;
                        const date = (time != null || undefined) ? await time.$eval('a', a => a.innerText) : null;
                        const category = (cat != null || undefined) ? await cat.$eval('a', a => a.innerText) : null;
                        const catLink = (catB != null || undefined) ? await catB.$eval('a', a => a.href) : null;
                        //  

                        let empty = null;
                        let emptyArr = "";
                        //
                        let tag = empty;
                        let src = "https://www.thesouthafrican.com/wp-content/uploads/2018/08/south_african_news_online.png";
                        let images = emptyArr;
                        let isVid = empty;
                        let vidLen = empty;


                        arrr.push({
                            url,
                            headline,
                            lede,
                            src,
                            thumbnail,
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
                        console.log('\x1b[42m%s\x1b[0m', `From ${this.uri} loop: ${error.name}`)
                        continue;
                    }
                }
                this.data = arrr;
                await page.close()
                console.log('\x1b[43m%s\x1b[0m', `Done: ${this.uri}`);

            } catch (error) {
                console.log('\x1b[41m%s\x1b[0m', `From ${this.uri} Main: ${error}`);
            }

            return this.data
        }
    }
}

module.exports = {
    Scrapper: Scrapper
};
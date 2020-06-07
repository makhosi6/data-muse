const express = require('express');
const wiredBusiness = express.Router();
const puppeteer = require('puppeteer');
require('dotenv').config();
const vars = require('./store/storeVars');
///
process.setMaxListeners(Infinity);
//
let add_business = [];
let add_science = [];
let add_gear = [];

async function main(uri_business, uri_science, uri_gear) {
    try {
        const browser = await puppeteer.launch({
            args: vars.argsArr,
            defaultViewport: null,
            headless: vars.bool,
            executablePath: vars.exPath
        });
        const page_business = await browser.newPage();
        page_business.setUserAgent(vars.userAgent);
        await page_business.goto(uri_business, { waitUntil: 'networkidle2', timeout: 0 });
        await page_business.waitForSelector('.card-component ul');
        const items_business = await page_business.$$('.card-component ul');
        await page_business.waitFor(5000);
        //
        for (const item of items_business) {
            try {
                const thumbnail = await item.$eval('img', img => img.src);
                const link = await item.$eval('a', a => a.href);
                const headline = await item.$eval('h2', h2 => h2.innerText);
                const author = await item.$eval('a.byline-component__link', a => a.innerText);
                const category = await item.$eval('span.brow-component--micro', span => span.innerText);
                add_business.push({
                    "category": category,
                    "url": link,
                    "thumbnail": thumbnail,
                    "headline": headline,
                    "author": author
                })
            } catch (error) {
                console.trace('\x1b[42m%s\x1b[0m', `From ${uri_gear} loop: ${error.name}`);
                continue;
            }
        }
        // ANOTHER ONE
        const page_science = await browser.newPage();
        page_science.setUserAgent(vars.userAgent);
        await page_science.goto(uri_science, { waitUntil: 'networkidle2', timeout: 0 });
        await page_science.waitForSelector('.card-component ul');
        const items_science = await page_science.$$('.card-component ul');
        await page_science.waitFor(5000);
        //
        for (const item of items_science) {
            try {
                const thumbnail = await item.$eval('img', img => img.src);
                const link = await item.$eval('a', a => a.href);
                const headline = await item.$eval('h2', h2 => h2.innerText);
                const author = await item.$eval('a.byline-component__link', a => a.innerText);
                const category = await item.$eval('span.brow-component--micro', span => span.innerText);
                add_science.push({
                    "category": category,
                    "url": link,
                    "thumbnail": thumbnail,
                    "headline": headline,
                    "author": author
                })

            } catch (error) {
                console.trace('\x1b[42m%s\x1b[0m', `From ${uri_gear} loop: ${error.name}`);
                continue;
            }
        }
        const page_gear = await browser.newPage();
        page_gear.setUserAgent(vars.userAgent);
        await page_gear.goto(uri_gear, { waitUntil: 'networkidle2', timeout: 0 });
        await page_gear.waitForSelector('.card-component ul');
        const items_gear = await page_gear.$$('.card-component ul');
        await page_gear.waitFor(5000);
        //
        for (const item of items_gear) {
            try {
                const thumbnail = await item.$eval('img', img => img.src);
                const link = await item.$eval('a', a => a.href);
                const headline = await item.$eval('h2', h2 => h2.innerText);
                const author = await item.$eval('a.byline-component__link', a => a.innerText);
                const category = await item.$eval('span.brow-component--micro', span => span.innerText);

                add_gear.push({
                    "category": category,
                    "url": link,
                    "thumbnail": thumbnail,
                    "headline": headline,
                    "author": author
                })

            } catch (error) {
                console.trace('\x1b[42m%s\x1b[0m', `From ${uri_gear} loop: ${error.name}`);
                continue;
            }

        }
        //

        console.log('\x1b[43m%s\x1b[0m', `Done: ${uri_gear}`);
        browser.close();
    } catch (error) {
        console.trace('\x1b[41m%s\x1b[0m', `From ${uri_gear} Main: ${error.name}`);
    }
}
let source_science = "https://www.wired.com/category/science/";
let source_business = "https://www.wired.com/category/business/";
let source_gear = "https://www.wired.com/category/gear/";
//
main(source_business, source_science, source_gear);
///
wiredBusiness.get('/wired-all', (req, res) => {
    res.send({
        "wiredScience": add_science,
        "wiredBusiness": add_business,
        "wiredGear": add_gear
    });
})

module.exports = wiredBusiness;
const express = require('express');
const kickOff = express.Router();
const wsChromeEndpointurl = require('../browser');
const puppeteer = require('puppeteer');
require('dotenv').config();
const cron = require("node-cron");
const vars = require('../store/storeVars');

///
process.setMaxListeners(Infinity);
//
let add = [];
let data = [];
let trends = [];
let src = "https://cdn.kickoff.com/assets/kickoff-logo@2x-3a7d35049d4a22e56ca2579da5c8d8df0edf67f40a78af4dab3de8f159c69494.png";
let add_list = [];
async function main(uri) {

    try {

        const browser = await puppeteer.connect({
            browserWSEndpoint: wsChromeEndpointurl,
            defaultViewport: null
        });
        const page = await browser.newPage();
        page.setUserAgent(vars.userAgent);
        await page.goto(uri, { waitUntil: 'networkidle2', timeout: 0 });
        await page.waitForSelector('.pod');
        await page.waitFor(12300);
        ///
        const items = await page.$$('.pod');
        //
        for (const item of items) {
            try {
                //
                const get = await item.$('.pod__image img');
                const check = await item.$('.icon-play.pod__video-icon');
                const url = await item.$eval('.pod__title > a', a => a.href);
                const headline = await item.$eval('.pod__title > a', a => a.innerText);
                const thumbnail = await page.evaluate(div => div.dataset.src, get);
                //
                let isVid = (check != null || undefined) ? true : false;
                let empty = null;
                let emptyArr = "";
                //
                let lede = empty;
                let category = empty;
                let catLink = empty;
                let tag = empty;
                //
                let images = emptyArr;
                //
                let vidLen = empty;
                //
                let author = empty;
                let date = empty;
                add.push({
                    url,
                    headline,
                    isVid,
                    src,
                    thumbnail,
                    //
                    lede,
                    category,
                    catLink,
                    tag,
                    //
                    images,
                    //
                    vidLen,
                    //
                    author,
                    date
                })
            } catch (error) {
                console.log('\x1b[42m%s\x1b[0m', `From ${uri} loop: ${error.name}`)
                continue;
            }
        }

        const obj = await page.$$('.tab-section');
        //
        for (const one of obj) {
            try {
                let btn = await one.$eval('a.button', a => a.innerText);
                const pods = await one.$$('.pod');

                for (const each of pods) {
                    try {
                        const url = await each.$eval('.pod__title > a', a => a.href);
                        const headline = await each.$eval('.pod__title > a', a => a.innerText);
                        // const btn = await each.$eval('a.button', a => a.innerText);
                        let a = btn.split('More ');
                        let category = a[1];

                        let empty = null;
                        let emptyArr = "";
                        //
                        let lede = empty;
                        let catLink = empty;
                        let tag = empty;
                        let thumbnail = empty;
                        //
                        let images = emptyArr;
                        //
                        let vidLen = empty;
                        let isVid = false;
                        //
                        let author = empty;
                        let date = empty;

                        data.push({
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
                        console.log('\x1b[42m%s\x1b[0m', `From ${uri} loopInside: ${error.name}`);
                    }
                }
                data.map((e) => trends.push(e));
            } catch (error) {
                console.log('\x1b[42m%s\x1b[0m', `From ${uri} loop: ${error.name}`)
            }
        }
        //
        const tr = await page.$$('body > main > section:nth-child(4) > div > div.col-lg-4.col-md-5.col-xs-12 > div > section > div > div.col-xs-12.col-lg-12.col-md-12 > div.row.row--no-margin-bottom.tab-sections--no-images-list > div > div.tab-section:nth-child(1) > div.pod ');
        for (const one of tr) {
            try {
                const link = await one.$eval('.pod__title > a', a => a.href);
                const headline = await one.$eval('.pod__title > a', a => a.innerText);
                // const btn = await each.$eval('a.button', a => a.innerText);
                trends.push({
                    "url": link,
                    "headline": headline,
                })
            } catch (error) {
                console.log('\x1b[42m%s\x1b[0m', `From ${uri} loop: ${error.name}`)

            }
        }
        await page.close();
        //
        const page_list = await browser.newPage();
        page_list.setUserAgent(vars.userAgent);
        await page_list.goto(uri, { waitUntil: 'networkidle2', timeout: 0 });
        await page_list.waitForSelector('table');
        await page_list.waitFor(12300);
        const items_list = await page_list.$$('table  > tbody > tr');
        const moreLink = await page_list.$('.col-xs-12.league-more-btn.is-desktop > a');
        const moreBtn = await page_list.evaluate(div => div.href, moreLink);

        let more = moreBtn;
        //
        for (const item of items_list) {
            try {
                //
                const num = await item.$('td:nth-child(2)');
                const teamlogo = await item.$('td:nth-child(3) > img');
                const team = await item.$('td:nth-child(3)');
                const pl = await item.$('td:nth-child(4)');
                const gd = await item.$('td:nth-child(10)');
                const pts = await item.$('td:nth-child(11)');
                const teamNum = await page_list.evaluate(div => div.innerText, num);
                const teamImg = await page_list.evaluate(div => div.dataset.src, teamlogo);
                const teamPl = await page_list.evaluate(div => div.innerText, pl);
                const teamGd = await page_list.evaluate(div => div.innerText, gd);
                const teamPts = await page_list.evaluate(div => div.innerText, pts);
                const teamName = await page_list.evaluate(el => el.textContent, team);

                add_list.push({
                    src,
                    more,
                    teamNum,
                    teamImg,
                    teamPl,
                    teamGd,
                    teamPts,
                    teamName
                })
            } catch (error) {
                console.log('\x1b[42m%s\x1b[0m', `From ${uri} loop: ${error.name}`)
                continue;
            }
        }
        await page_list.close();
        console.log('\x1b[43m%s\x1b[0m', `Done: ${uri}`);

    } catch (error) {
        console.log('\x1b[41m%s\x1b[0m', `From ${uri} Main: ${error}`);
    }
}
let source = "https://www.kickoff.com/";

cron.schedule("0 3 * * *", () => {
    (() => {
        console.log('\x1b[46m%s\x1b[0m', "KICKOFF fired at:" + Date());
        main(source);
    })();
});
/////
module.exports = {

    "news": add,
    "trends": trends,
    "table list": add_list
}
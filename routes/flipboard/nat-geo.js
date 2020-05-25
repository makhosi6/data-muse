const express = require('express');
const natGeoAnimals = express.Router();
const puppeteer = require('puppeteer');
const BROWSER = process.env.BROWSER;
const IS_PRODUCTION = process.env.NODE_ENV === 'production';
//

process.setMaxListeners(Infinity);

///
let add_animals = [];
let add_news = [];
let add_enviro = [];
let add_photo = [];
let add_science = [];
let add_travel = [];


async function main(uri_animals, uri_news, uri_enviro, uri_photo, uri_science, uri_travel) {

    try {
        const browser = (IS_PRODUCTION) ?
            await puppeteer.connect({
                browserWSEndpoint: `wss://chrome.browserless.io/?token=${BROWSER}`
            }) :
            await puppeteer.launch({
                args: [
                    "--ignore-certificate-errors",
                    "--no-sandbox",
                    '--disable-dev-shm-usage',
                    "--disable-setuid-sandbox",
                    "--window-size=1920,1080",
                    "--disable-accelerated-2d-canvas",
                    "--disable-gpu"
                ],
                defaultViewport: null,
                executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe'

            });

        const page_animals = await browser.newPage();
        page_animals.setUserAgent('Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML; like Gecko) snap Chromium/80.0.3987.122 Chrome/80.0.3987.122 Safari/537.36');
        await page_animals.goto(uri_animals, { waitUntil: 'networkidle2', timeout: 0 });
        await page_animals.waitForSelector('.item-list');
        const items_animals = await page_animals.$$('.post__section-item-display');
        //
        for (let i = 0; i < items.length; i++) {
            try {
                await page_animals.goto(uri_animals, { waitUntil: 'networkidle2', timeout: 0 });
                await page_animals.waitForSelector('.item-list');
                const items_animals = await page_animals.$$('.post__section-item-display');


                const item = items_animals[i];
                const title = await item.$('.post__title');
                const link = await title.$eval('a', a => a.href);
                const para = await item.$('.post__excerpt');
                const mediaLink = await item.$eval('img', img => img.src);
                const headlineText = await title.$eval('a.internal-link', a => a.innerText);
                const tagEl = await item.$('a.topic-tag');
                const tag = (tagEl != null || undefined) ? await item.$eval('a.topic-tag', a => a.innerText) : null;
                const cred = await item.$('.post-attribution__source');
                const source = (cred != null || undefined) ? await cred.$eval('a', a => a.innerText) : null;
                const lede = await para.$eval('a', a => a.innerText);
                const timeStamp = await item.$eval('time', time => time.innerText);
                //
                const publisher = source.replace(" and ", " & ");
                ////
                const windo = await item.$('.post__title > a');

                windo.click();

                await page_animals.waitFor(33000);
                await page_animals.waitForSelector('.post__read-more');
                let button = await page_animals.$x('//*[@id="content"]/div/main/div/div/div[1]/div/div[2]');

                let ellen = await page_animals.waitForSelector('.post__read-more');
                const url = (button != null || undefined) ? await ellen.$eval('a', a => a.href) : null;

                const a = url.split("url=");
                const b = a[1];
                const c = b.split("&v=");
                const d = c[0];
                const e = decodeURIComponent(d);


                add_animals.push({

                    "url": e,
                    "media_link": mediaLink,
                    "headline": headlineText,
                    "tag": tag,
                    "source": publisher,
                    "lede": lede,
                    "time_stamp": timeStamp
                });
            } catch (error) {
                console.log(`From ${uri_animals} loop: ${error}`.bgMagenta);
            }

        }

        ///


        const page_news = await browser.newPage();
        page_news.setUserAgent('Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML; like Gecko) snap Chromium/80.0.3987.122 Chrome/80.0.3987.122 Safari/537.36');
        await page.goto(uri_news, { waitUntil: 'networkidle2', timeout: 0 });
        await page.waitForSelector('.item-list');
        const items_news = await page.$$('.post__section-item-display');

        //
        for (let i = 0; i < items_news.length; i++) {
            try {

                await page_news.goto(uri_news, { waitUntil: 'networkidle2', timeout: 0 });
                await page_news.waitForSelector('.item-list');
                const items_news = await page_news.$$('.post__section-item-display');


                const item = items_news[i];
                const title = await item.$('.post__title');
                const link = await title.$eval('a', a => a.href);
                const para = await item.$('.post__excerpt');
                const mediaLink = await item.$eval('img', img => img.src);
                const headlineText = await title.$eval('a.internal-link', a => a.innerText);
                const tagEl = await item.$('a.topic-tag');
                const tag = (tagEl != null || undefined) ? await item.$eval('a.topic-tag', a => a.innerText) : null;
                const cred = await item.$('.post-attribution__source');
                const source = (cred != null || undefined) ? await cred.$eval('a', a => a.innerText) : null;
                const lede = await para.$eval('a', a => a.innerText);
                const timeStamp = await item.$eval('time', time => time.innerText);
                //
                const publisher = source.replace(" and ", " & ");
                ////
                const windo = await item.$('.post__title > a');

                windo.click();

                await page_news.waitFor(33000);
                await page_news.waitForSelector('.post__read-more');
                let button = await page_news.$x('//*[@id="content"]/div/main/div/div/div[1]/div/div[2]');

                let ellen = await page_news.waitForSelector('.post__read-more');
                const url = (button != null || undefined) ? await ellen.$eval('a', a => a.href) : null;

                const a = url.split("url=");
                const b = a[1];
                const c = b.split("&v=");
                const d = c[0];
                const e = decodeURIComponent(d);


                add_news.push({

                    "url": e,
                    "media_link": mediaLink,
                    "headline": headlineText,
                    "tag": tag,
                    "source": publisher,
                    "lede": lede,
                    "time_stamp": timeStamp
                });
            } catch (error) {
                console.log(`From ${uri_news} loop: ${error}`.bgMagenta);
            }

        }

        // 

        const page_enviro = await browser.newPage();
        page_enviro.setUserAgent('Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML; like Gecko) snap Chromium/80.0.3987.122 Chrome/80.0.3987.122 Safari/537.36');
        await page_enviro.goto(uri_enviro, { waitUntil: 'networkidle2', timeout: 0 });
        await page.waitForSelector('.item-list');
        const items_enviro = await page_enviro.$$('.post__section-item-display');
        //
        for (let i = 0; i < items_enviro.length; i++) {
            try {
                ///
                await page_enviro.goto(uri_enviro, { waitUntil: 'networkidle2', timeout: 0 });
                await page_enviro.waitForSelector('.item-list');
                const items_enviro = await page_enviro.$$('.post__section-item-display');
                const item = items_enviro[i];
                const title = await item.$('.post__title');
                const link = await title.$eval('a', a => a.href);
                const para = await item.$('.post__excerpt');
                const mediaLink = await item.$eval('img', img => img.src);
                const headlineText = await title.$eval('a.internal-link', a => a.innerText);
                const tagEl = await item.$('a.topic-tag');
                const tag = (tagEl != null || undefined) ? await item.$eval('a.topic-tag', a => a.innerText) : null;
                const cred = await item.$('.post-attribution__source');
                const source = (cred != null || undefined) ? await cred.$eval('a', a => a.innerText) : null;
                const lede = await para.$eval('a', a => a.innerText);
                const timeStamp = await item.$eval('time', time => time.innerText);
                //
                const publisher = source.replace(" and ", " & ");
                ////
                const windo = await item.$('.post__title > a');

                windo.click();

                await page_enviro.waitFor(33000);
                await page_enviro.waitForSelector('.post__read-more');
                let button = await page_enviro.$x('//*[@id="content"]/div/main/div/div/div[1]/div/div[2]');
                let ellen = await page_enviro.waitForSelector('.post__read-more');
                const url = (button != null || undefined) ? await ellen.$eval('a', a => a.href) : null;

                const a = url.split("url=");
                const b = a[1];
                const c = b.split("&v=");
                const d = c[0];
                const e = decodeURIComponent(d);

                add_enviro.push({
                    "url": e,
                    "media_link": mediaLink,
                    "headline": headlineText,
                    "tag": tag,
                    "source": publisher,
                    "lede": lede,
                    "time_stamp": timeStamp
                });

            } catch (error) {
                console.log(`From ${uri_enviro} loop: ${error}`.bgMagenta);
            }
        }
        // 


        const page_photo = await browser.newPage();
        page_photo.setUserAgent('Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML; like Gecko) snap Chromium/80.0.3987.122 Chrome/80.0.3987.122 Safari/537.36');

        await page_photo.goto(uri_photo, { waitUntil: 'networkidle2', timeout: 0 });
        await page_photo.waitForSelector('.item-list');
        const items_photo = await page_photo.$$('.post__section-item-display');

        //
        for (let i = 0; i < items_photo.length; i++) {
            try {
                await page_photo.goto(uri_photo, { waitUntil: 'networkidle2', timeout: 0 });
                await page_photo.waitForSelector('.item-list');
                const items_photo = await page_photo.$$('.post__section-item-display');
                const item = items_photo[i];
                const title = await item.$('.post__title');
                const link = await title.$eval('a', a => a.href);
                const para = await item.$('.post__excerpt');
                const mediaLink = await item.$eval('img', img => img.src);
                const headlineText = await title.$eval('a.internal-link', a => a.innerText);
                const tagEl = await item.$('a.topic-tag');
                const tag = (tagEl != null || undefined) ? await item.$eval('a.topic-tag', a => a.innerText) : null;
                const cred = await item.$('.post-attribution__source');
                const source = (cred != null || undefined) ? await cred.$eval('a', a => a.innerText) : null;
                const lede = await para.$eval('a', a => a.innerText);
                const timeStamp = await item.$eval('time', time => time.innerText);
                //
                const publisher = source.replace(" and ", " & ");
                ////
                const windo = await item.$('.post__title > a');

                windo.click();

                await page_photo.waitFor(33000);
                await page_photo.waitForSelector('.post__read-more');
                let button = await page_photo.$x('//*[@id="content"]/div/main/div/div/div[1]/div/div[2]');

                let ellen = await page_photo.waitForSelector('.post__read-more');
                const url = (button != null || undefined) ? await ellen.$eval('a', a => a.href) : null;

                const a = url.split("url=");
                const b = a[1];
                const c = b.split("&v=");
                const d = c[0];
                const e = decodeURIComponent(d);


                add_photo.push({
                    "url": e,
                    "media_link": mediaLink,
                    "headline": headlineText,
                    "tag": tag,
                    "source": publisher,
                    "lede": lede,
                    "time_stamp": timeStamp
                });

            } catch (error) {
                console.log(`From ${uri_photo} loop: ${error}`.bgMagenta);
            }
        }

        // 


        const page_science = await browser.newPage();
        page_science.setUserAgent('Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML; like Gecko) snap Chromium/80.0.3987.122 Chrome/80.0.3987.122 Safari/537.36');
        await page_science.goto(uri_science, { waitUntil: 'networkidle2', timeout: 0 });
        await page_science.waitForSelector('.item-list');
        const items_science = await page_science.$$('.post__section-item-display');
        //
        for (let i = 0; i < items_science.length; i++) {
            try {
                await page_science.goto(uri_science, { waitUntil: 'networkidle2', timeout: 0 });
                await page_science.waitForSelector('.item-list');
                const items_science = await page_science.$$('.post__section-item-display');


                const item = items_science[i];
                const title = await item.$('.post__title');
                const link = await title.$eval('a', a => a.href);
                const para = await item.$('.post__excerpt');
                const mediaLink = await item.$eval('img', img => img.src);
                const headlineText = await title.$eval('a.internal-link', a => a.innerText);
                const tagEl = await item.$('a.topic-tag');
                const tag = (tagEl != null || undefined) ? await item.$eval('a.topic-tag', a => a.innerText) : null;
                const cred = await item.$('.post-attribution__source');
                const source = (cred != null || undefined) ? await cred.$eval('a', a => a.innerText) : null;
                const lede = await para.$eval('a', a => a.innerText);
                const timeStamp = await item.$eval('time', time => time.innerText);
                //
                const publisher = source.replace(" and ", " & ");
                ////
                const windo = await item.$('.post__title > a');

                windo.click();

                await page_science.waitFor(33000);
                await page_science.waitForSelector('.post__read-more');
                let button = await page_science.$x('//*[@id="content"]/div/main/div/div/div[1]/div/div[2]');
                let ellen = await page_science.waitForSelector('.post__read-more');
                const url = (button != null || undefined) ? await ellen.$eval('a', a => a.href) : null;

                const a = url.split("url=");
                const b = a[1];
                const c = b.split("&v=");
                const d = c[0];
                const e = decodeURIComponent(d);


                add_science.push({

                    "url": e,
                    "media_link": mediaLink,
                    "headline": headlineText,
                    "tag": tag,
                    "source": publisher,
                    "lede": lede,
                    "time_stamp": timeStamp
                });
            } catch (error) {
                console.log(`From ${uri_science} loop: ${error}`.bgMagenta);
            }

        }

        const page_travel = await browser.newPage();
        page_travel.setUserAgent('Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML; like Gecko) snap Chromium/80.0.3987.122 Chrome/80.0.3987.122 Safari/537.36');

        await page_travel.goto(uri_travel, { waitUntil: 'networkidle2', timeout: 0 });
        await page_travel.waitForSelector('.item-list');
        const items_travel = await page_travel.$$('.post__section-item-display');

        //
        for (let i = 0; i < items.length; i++) {
            try {
                await page_travel.goto(uri_travel, { waitUntil: 'networkidle2', timeout: 0 });
                await page_travel.waitForSelector('.item-list');
                const items_travel = await page_travel.$$('.post__section-item-display');


                const item = items_travel[i];
                const title = await item.$('.post__title');
                const link = await title.$eval('a', a => a.href);
                const para = await item.$('.post__excerpt');
                const mediaLink = await item.$eval('img', img => img.src);
                const headlineText = await title.$eval('a.internal-link', a => a.innerText);
                const tagEl = await item.$('a.topic-tag');
                const tag = (tagEl != null || undefined) ? await item.$eval('a.topic-tag', a => a.innerText) : null;
                const cred = await item.$('.post-attribution__source');
                const source = (cred != null || undefined) ? await cred.$eval('a', a => a.innerText) : null;
                const lede = await para.$eval('a', a => a.innerText);
                const timeStamp = await item.$eval('time', time => time.innerText);
                //
                const publisher = source.replace(" and ", " & ");
                ////
                const windo = await item.$('.post__title > a');

                windo.click();

                await page_travel.waitFor(33000);
                await page_travel.waitForSelector('.post__read-more');
                let button = await page_travel.$x('//*[@id="content"]/div/main/div/div/div[1]/div/div[2]');

                let ellen = await page_travel.waitForSelector('.post__read-more');
                const url = (button != null || undefined) ? await ellen.$eval('a', a => a.href) : null;

                const a = url.split("url=");
                const b = a[1];
                const c = b.split("&v=");
                const d = c[0];
                const e = decodeURIComponent(d);


                add_travel.push({
                    "url": e,
                    "media_link": mediaLink,
                    "headline": headlineText,
                    "tag": tag,
                    "source": publisher,
                    "lede": lede,
                    "time_stamp": timeStamp
                });
            } catch (error) {
                console.log(`From ${uri_travel} loop: ${error}`.bgMagenta);
            }
        }
        // 
        console.log(`Done: ${uri_news}`.bgYellow);
        browser.close();
    } catch (error) {
        console.log(`From ${uri_news} Main: ${error}`.bgRed);
    }
}

let source_animals = "https://flipboard.com/@nationalgeographic/animals-et7cccbnz";
let source_news = "https://flipboard.com/@enews";
let source_enviro = "https://flipboard.com/@espn";
let source_photo = "https://flipboard.com/@espn";
let source_science = "https://flipboard.com/@nationalgeographic/science-b8caucnjz";
let source_travel = "https://flipboard.com/@nationalgeographic/travel-es7qj2fiz";
//
main(source_animals, source_news, source_enviro, source_photo, source_science, source_travel);
//
natGeoAnimals.get('/flipboard/natgeo', (req, res) => {
    res.send({

        "natGeoAnimals": add_animals,
        "natGeoNews": add_news,
        "espnNatGoe": add_enviro,
        "natGeoPhoto": add_photo,
        "natGeoSci": add_science,
        "natGeoTravel": add_travel
    });
})

module.exports = natGeoAnimals;
const express = require('express');
const foodWine = express.Router();
const puppeteer = require('puppeteer');
const BROWSER = process.env.BROWSER;
const IS_PRODUCTION = process.env.NODE_ENV === 'production';
//
process.setMaxListeners(Infinity);
///
let add_news = [];
let add_recipe = [];
async function main(uri_news) {
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

        const page_news = await browser.newPage();
        page_news.setUserAgent('Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML; like Gecko) snap Chromium/80.0.3987.122 Chrome/80.0.3987.122 Safari/537.36');

        await page_news.goto(uri_news, { waitUntil: 'networkidle2', timeout: 0 });
        await page_news.waitForSelector('.item-list');
        const items_news = await page_news.$$('.post__section-item-display');

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


        const page_recipe = await browser.newPage();
        page_recipe.setUserAgent('Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML; like Gecko) snap Chromium/80.0.3987.122 Chrome/80.0.3987.122 Safari/537.36');
        await page_recipe.goto(uri_recipe, { waitUntil: 'networkidle2', timeout: 0 });
        await page_recipe.waitForSelector('.item-list');
        const items_recipe = await page_recipe.$$('.post__section-item-display');

        //
        for (let i = 0; i < items_recipe.length; i++) {
            try {
                await page_recipe.goto(uri_recipe, { waitUntil: 'networkidle2', timeout: 0 });
                await page_recipe.waitForSelector('.item-list');
                const items_recipe = await page_recipe.$$('.post__section-item-display');


                const item = items_recipe[i];
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

                await page_recipe.waitFor(33000);
                await page_recipe.waitForSelector('.post__read-more');
                let button = await page_recipe.$x('//*[@id="content"]/div/main/div/div/div[1]/div/div[2]');

                let ellen = await page_recipe.waitForSelector('.post__read-more');
                const url = (button != null || undefined) ? await ellen.$eval('a', a => a.href) : null;

                const a = url.split("url=");
                const b = a[1];
                const c = b.split("&v=");
                const d = c[0];
                const e = decodeURIComponent(d);


                add_recipe.push({

                    "url": e,
                    "media_link": mediaLink,
                    "headline": headlineText,
                    "tag": tag,
                    "source": publisher,
                    "lede": lede,
                    "time_stamp": timeStamp
                });
            } catch (error) {
                console.log(`From ${uri_recipe} loop: ${error}`.bgMagenta);
            }

        }
        //
        console.log(`Done: ${uri_news}`.bgYellow);
        browser.close();
    } catch (error) {
        console.log(`From ${uri_news} Main: ${error}`.bgRed);
    }

}
let source_news = "https://flipboard.com/@foodandwine";
let source_recipe = "https://flipboard.com/@foodandwine/recipes-n1s9kfsoz";
//
main(source_news, source_recipe);
/////////////
foodWine.get('/foodwine', (req, res) => {
    res.send({

        "foodWine": add_news,
        "foodWineRecipes": add_recipe
    });
})

module.exports = foodWine;
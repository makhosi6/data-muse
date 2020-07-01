const puppeteer = require('puppeteer');
const vars = require('./store/storeVars');
//
(async function() {
    const browser = await puppeteer.launch({
        args: vars.argsArr,
        defaultViewport: null,
        headless: vars.bool,
        // executablePath: vars.exPath
    });
    console.log({
        "Browser Info": {
            wsEndpoint: browser.wsEndpoint(),
            version: await browser.version(),
            userAgent: await browser.userAgent(),
            context: browser.defaultBrowserContext()
        }
    })
    module.exports = browser.wsEndpoint();
})();
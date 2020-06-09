const puppeteer = require('puppeteer');
const vars = require('./routes/store/storeVars');


//
(async function() {
    const browser = await puppeteer.launch({
        args: vars.argsArr,
        defaultViewport: null,
        headless: vars.bool,
        executablePath: vars.exPath
    });
    console.log(browser.wsEndpoint())
    module.exports = browser.wsEndpoint();

    // setTimeout(() => {
    //     browser.close();
    // }, 12231414544);

})();

// module.exports = "ws://127.0.0.1:62338/devtools/browser/2f3838fe-4732-47ad-af51-ae95b1fcf0f3"
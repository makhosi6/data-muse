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

    module.exports = browser;

})();
const express = require("express");
const Routa = express.Router();

module.exports = {
    Routa,
    argsArr: [
        "--ignore-certificate-errors",
        "--no-sandbox",
        '--disable-dev-shm-usage',
        "--disable-setuid-sandbox",
        "--window-size=1920,1080",
        "--disable-accelerated-2d-canvas",
        "--disable-gpu"
    ],
    exPath: 'C:/Users/LG/Desktop/show/node_modules/puppeteer/.local-chromium/win32-756035/chrome-win/chrome.exe',
    bool: false,
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; ) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.0 Safari/537.36'
        // userAgent: 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML; like Gecko) snap Chromium/80.0.3987.122 Chrome/80.0.3987.122 Safari/537.36'

};
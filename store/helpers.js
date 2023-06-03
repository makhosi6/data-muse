const express = require("express");
const Routa = express.Router();
const fetch = require('node-fetch');
const filterAll = require('filter-empty')
require('dotenv').config();

/**
 *
 * @param str string
 * @returns
 */
function hashCode(str) {
  return Array.from(str)
    .reduce((s, c) => (Math.imul(31, s) + c.charCodeAt(0)) | 0, 0)
    .toString();
}

module.exports = {
  Routa,
  timestamp: () => {
    let a = `${new Date()}`;
    let b = a.replace(" GMT+0200 (South Africa Standard Time)", "");
    return b;
  },
  sanitize: (data)=> filterAll(data),
  interfaceAPI: async (data) => {
    
    fetch(process.env.MUSE_API +"/articles", {
      method: "POST",
      body: JSON.stringify(filterAll({...data, ...{id: hashCode(data.url)}})),
      headers: {
        Authorization: `${process.env.TOKEN}`,
        "Content-type": "application/json",
        
      },
    })
      .then((res) => res.json())
      .then(json => console.log(json))
      .then(() => {
        console.info("\x1b[32m%s\x1b[0m", "interfaceAPI: Success");
      })
      .catch((e) => {
        console.log(e);
        throw new Error(e);
        // console.log({e});
      });
  },
  argsArr: [
    "--ignore-certificate-errors",
    "--no-sandbox",
    "--disable-dev-shm-usage",
    "--disable-setuid-sandbox",
    "--window-size=1920,1080",
    "--disable-accelerated-2d-canvas",
    "--disable-gpu",
  ],
  exPath:
    "C:/Users/LG/Desktop/show/node_modules/puppeteer/.local-chromium/win32-756035/chrome-win/chrome.exe",
  bool: false,
  // userAgent: "Mozilla/5.0 (Windows NT 10.0; ) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.0 Safari/537.36",
  
  userAgent: 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML; like Gecko) snap Chromium/80.0.3987.122 Chrome/80.0.3987.122 Safari/537.36',
};
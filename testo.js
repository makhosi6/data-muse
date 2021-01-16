const puppeteer = require('puppeteer');
const wsChromeEndpointurl = require("./browser");
const express = require("express");
const Routa = express.Router();
const vars = require("./store/storeVars");
let d;
let z = []
async function run(uri) {
    try {
        
    
    console.log('pitch: ',wsChromeEndpointurl);
    
    const browser = await puppeteer.launch({headless: false});
    let page = await browser.newPage();
    await page.setViewport({ width: 1920, height: 1080 });
    await page.setRequestInterception(true);
    
    page.on('request', (req) => {
        if(req.resourceType() == 'stylesheet' || req.resourceType() == 'font' || req.resourceType() == 'image'|| req.resourceType() == 'script' || req.resourceType() == 'javascript' ){
            req.abort();
        }
        else {
            req.continue();
        }
    });
    
    await page.goto(uri, { waitUntil: "networkidle2", timeout: 0 });
    // await page.waitFor(5000);
    await page.waitForSelector("article");
    const emAll = await page.$$("article");

    for (const each of emAll) {
      try {
        const time = await each.$("h1 > a");
        const ab = await each.$("a");
        d =
          time != null || undefined
            ? await page.evaluate((i) => i.innerText, time)
            : null;
            // console.log({d});
            z.push(d)
      }catch(e){
          console.warn(e);
      }
}
} catch (error) {
        console.log("RED: ", error);
}}

    let source = "https://flipboard.com/@enews";
    run(source);


//
Routa.get("/wat", (req, res) => {
    res.send({
     number: "14994-34.330.00",
     record: z
    });
  });
  module.exports = Routa;
const express = require('express');
const bodyParser = require('body-parser');
const wsChromeEndpointurl = require('./browser');
const cors = require('cors');
require('dotenv').config()
console.log('url:', wsChromeEndpointurl);
setTimeout(() => {
    // //middleware 
    const app = express();
    app.use(cors());
    app.use(bodyParser.json());
    //
    //All_routes
    // const test = require('./testTwo.js');
    const africa = require('./end-points/africa');
    const business = require('./end-points/business');
    const health = require('./end-points/health');
    const hot = require('./end-points/hot');
    const lifestyle = require('./end-points/lifestyle');
    const news = require('./end-points/news');
    const science = require('./end-points/science');
    const sport = require('./end-points/sport');
    const tech = require('./end-points/tech');
    const trends = require('./end-points/trends');
    //
    let arr = [africa, business, health, hot, lifestyle, news, science, sport, tech, trends]
        //
    app.use('/api/v1/', arr);
    const env = process.env.NODE_ENV;
    const PORT = process.env.PORT;
    //Fiv nat-geo uri
    app.listen(PORT, console.log('\x1b[45m%s\x1b[0m', `Running in ${env} mode on port ${PORT}. And ${arr.length} routes went live on ${Date()}`));

}, 30000);
/*
"engines": {
        "node": "12.16.1",
        "npm": "6.13.4"
    },

TO SCRAPP
https://theconversation.com/
https://www.complex.com/

--> itemtype="http://schema.org/Person"

*/
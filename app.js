const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();

require('dotenv').config()

// //middleware 
app.use(cors());
app.use(bodyParser.json());
//
//All_routes
const test = require('./test');
const cgtnNews = require('./routes/cgtn');
const enews = require('./routes/flipboard/enews')
const espn = require('./routes/flipboard/espn');
const foodWine = require('./routes/flipboard/foodWine');
const natGeo = require('./routes/flipboard/nat-geo');
const timesLive = require('./routes/timeslive');
const bbcRouter = require('./routes/bbc');
const enca = require('./routes/enca');
const ewnRouta = require('./routes/ewn');;
const hbr = require('./routes/hbr');
const cnnRouta = require('./routes/cnn');
const wired = require('./routes/wired');
const aljRouta = require('./routes/alj');
const saNews = require('./routes/saScrapper');
const sabcNews = require('./routes/sabc');
const mgNews = require('./routes/mAndG');
const blomNews = require('./routes/bloomberg');
const citizen = require('./routes/citizen');
const africa = require('./routes/africa');
const laduma = require('./routes/laduma');
const w24 = require('./routes/life');
const magz = require('./routes/magz');
const kickOff = require('./routes/kickoff');


//base route
let arr = [
    /*ewn*/
    ewnRouta,
    /*enews*/
    enews,
    /*bbc*/
    bbcRouter,
    /*HBR*/
    hbr,
    /*enca*/
    enca,
    /*alj*/
    aljRouta,
    /*sa*/
    saNews,
    /*cnn*/
    cnnRouta,
    /*WIneFOODF*/
    foodWine,
    /*espnF*/
    espn,
    /*natGeoF*/
    natGeo,
    /*wired*/
    wired,
    /*TimesLive*/
    timesLive,
    /*Sabc*/
    sabcNews,
    /*mgNews*/
    mgNews,
    /*Bloomberg*/
    blomNews,
    //*africa*/
    africa,
    /*citizen*/
    citizen,
    /*cgtnNews*/
    cgtnNews,
    /*magz*/
    laduma, w24, magz, kickOff
];
// 
//
// console.log(__dirname)
// console.log(__filename)
app.use('/api/v1/', arr);
const env = process.env.NODE_ENV;
const PORT = process.env.PORT;
//Fiv nat-geo uri
app.listen(PORT, console.log(`Running in ${env} mode on port ${PORT}. And ${arr.length} routes went live on ${Date()}`.bgGreen));
// ${arr.length}

//
/*
git add .
git commit -m "Updates  10/05/2020"
git pull
git push

 /app/node_modules/puppeteer/.local-chromium/linux-706915 


"engines": {
        "node": "12.16.1",
        "npm": "6.13.4"
    },

let id = 'hotfix1fb7853';
linux = 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML; like Gecko) snap Chromium/80.0.3987.122 Chrome/80.0.3987.122 Safari/537.36'
let userAgent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.149 Safari/537.36';

"engines": {
        "node": "12.16.1",
        "npm": "6.13.4"
    },
gcloud config set project scrapper-276814
const param_puppeteer = {
    args: [
        "--incognito",
        "--ignore-certificate-errors",
        "--no-sandbox",
        '--disable-dev-shm-usage',
        "--disable-setuid-sandbox",
        "--window-size=1920,1080",
        "--disable-accelerated-2d-canvas",
        "--disable-gpu"
    ],
     defaultViewport: null
    headless: false,
    executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe'

}


let db = "mongodb+srv://<username>:<password>@cluster0-kwyfa.mongodb.net/test?retryWrites=true&w=majority";

let dbTrue = "mongodb+srv://makhosi:<password>@cluster0-kwyfa.mongodb.net/test?retryWrites=true&w=majority";
let dbPass = "mostsecure";
let userName = "makhosi";
--> itemtype="http://schema.org/Person"
--> each folder to have one route 
-->Open diff looop in one file
-->one browser instanceand diff tabs using the [newPage()] method
*/
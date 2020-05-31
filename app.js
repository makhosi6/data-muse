const express = require('express');
const bodyParser = require('body-parser');
//TO DO : fix the natGeo fLIPBOURD LINKS
const cors = require('cors');
const app = express();

require('dotenv').config()

// //middleware 
app.use(cors());
app.use(bodyParser.json());
//
//All_routes
// const test = require('./test');
// const cgtnNews = require('./routes/cgtn');
// const enews = require('./routes/flipboard/enews')
// const espn = require('./routes/flipboard/espn');
const foodWine = require('./routes/flipboard/foodWine');
const natGeo = require('./routes/flipboard/nat-geo');
// const timesLive = require('./routes/timeslive');
// const bbcRouter = require('./routes/bbc');
// const enca = require('./routes/enca');
// const ewnRouta = require('./routes/ewn');;
// const hbr = require('./routes/hbr');
// const cnnRouta = require('./routes/cnn');
// const wired = require('./routes/wired');
// const aljRouta = require('./routes/alj');
// const saNews = require('./routes/saScrapper');
// const sabcNews = require('./routes/sabc');
// const mgNews = require('./routes/mAndG');
// const blomNews = require('./routes/bloomberg');
// const citizen = require('./routes/citizen');
// const africa = require('./routes/africa');
// const laduma = require('./routes/laduma');
// const w24 = require('./routes/life');
// const magz = require('./routes/magz');
// const kickOff = require('./routes/kickoff');


//base route
let arr = [
    //     /*ewn*/
    //     ewnRouta,
    //     /*enews*/
    //     enews,
    //     /*bbc*/
    //     bbcRouter,
    //     /*HBR*/
    //     hbr,
    //     /*enca*/
    //     enca,
    //     /*alj*/
    //     aljRouta,
    //     /*sa*/
    //     saNews,
    //     /*cnn*/
    //     cnnRouta,
    /*WIneFOODF*/
    foodWine,
    //     /*espnF*/
    //     espn,
    /*natGeoF*/
    natGeo,
    //     /*wired*/
    //      wired,
    //     /*TimesLive*/
    //     timesLive,
    //     /*Sabc*/
    //     sabcNews,
    //     /*mgNews*/
    //     mgNews,
    //     /*Bloomberg*/
    //     blomNews,
    //     //*africa*/
    //     africa,
    //     /*citizen*/
    //     citizen,
    //     /*cgtnNews*/
    //     cgtnNews,
    //     /*magz*/
    //     laduma, w24, magz, kickOff
];
// 
app.use('/api/v1/', arr);
const env = process.env.NODE_ENV;
const PORT = process.env.PORT;
//Fiv nat-geo uri
app.listen(PORT, console.log('\x1b[42m%s\x1b[0m', `Running in ${env} mode on port ${PORT}. And ${arr.length} routes went live on ${Date()}`));

/*
git add .
git commit -m "Updates 10/05/2020"
git pull
git push

"engines": {
        "node": "12.16.1",
        "npm": "6.13.4"
    },


let db = "mongodb+srv://<username>:<password>@cluster0-kwyfa.mongodb.net/test?retryWrites=true&w=majority";

let dbTrue = "mongodb+srv://makhosi:<password>@cluster0-kwyfa.mongodb.net/test?retryWrites=true&w=majority";
let dbPass = "mostsecure";
let userName = "makhosi";
--> itemtype="http://schema.org/Person"
--> each folder to have one route 
-->Open diff looop in one file
--x>one browser instanceand diff tabs using the [newPage()] method
*/
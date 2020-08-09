const express = require('express');
const bodyParser = require('body-parser');
const wsChromeEndpointurl = require('./browser');
const cors = require('cors');
require('dotenv').config();

/*
 TO-DO => REMOVE THE process.setMaxListeners(Infinity);
        => AND THE finally {} BLOCK AFTER catch{} BLOCK TO CLOSE A PAGE.


*/ 


//
console.log("wsChromeEndpointurl :", wsChromeEndpointurl);
//
setTimeout(() => {
    //ROUTES
    const test = require('./testTwo.js');
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
    const saNews = require('./routes/sa');
    const sabcNews = require('./routes/sabc');
    const mgNews = require('./routes/mAndG');
    const blomNews = require('./routes/bloomberg');
    const citizen = require('./routes/citizen');
    const africa = require('./routes/africa');
    const laduma = require('./routes/laduma');
    const w24 = require('./routes/life');
    const magz = require('./routes/magz');
    const kickOff = require('./routes/kickoff');
    const trendsRouta = require('./routes/trends-hot');
    //
    let Routa = [
        // test,
        /*ewn*/
        ewnRouta,
        /*trends*/
        trendsRouta,
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

    //middleware 
    const app = express();
    app.use(cors());
    app.use(bodyParser.json());
    //
    app.use((error, req, res, next) => {
        res.status(error.status);
        res.json({
            status: error.status,
            message: error.message,
            stack: error.stack
        });
    });
    app.use('/api/v1/', Routa);
    const env = process.env.NODE_ENV;
    const PORT = process.env.PORT;
    //Fiv nat-geo uri
    app.listen(PORT, console.log('\x1b[45m%s\x1b[0m', `Running in ${env} mode on port ${PORT}. And ${Routa.length} routes went live on ${Date()}`));

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



git add . 
git commit -m "01/07/2020"
git pull
git push
*/
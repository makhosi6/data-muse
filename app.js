const express = require('express');
const bodyParser = require('body-parser');
const wsChromeEndpointurl = require('./browser');
const { Routa } = require('./store/storeVars')
const cors = require('cors');
require('dotenv').config()


setTimeout(() => {
    // //middleware 
    const app = express();
    app.use(cors());
    app.use(bodyParser.json());
    //
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

*/
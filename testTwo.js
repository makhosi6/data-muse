const express = require('express');
require('dotenv').config()
const aljRouta = express.Router();
const puppet = require('./routes/store/puppetAlj');
const puppett = require('./routes/store/puppetCnn');

//
process.setMaxListeners(Infinity);
//
let empty = null;
let emptyArr = [];


let source = {
        docs: "https://www.aljazeera.com/documentaries/",
        africa: "https://edition.cnn.com/africa",
        trending: "https://www.aljazeera.com/",
        news: "https://www.aljazeera.com/topics/regions/africa.html",
    }
    //

const Puppet = puppet.Scrapper;

const dataNews = new Puppet(source.news);
dataNews.puppet();

//////
const Puppett = puppett.Scrapper;

const dataT = new Puppett(source.africa);
dataT.puppet();


///
aljRouta.get('/buzzz', (req, res) => {
    res.send({

        "aljNews": dataNews.data,
        "cnn":dataT.data

    });
})
module.exports = aljRouta;
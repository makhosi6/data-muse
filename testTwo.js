(function() {
    const express = require("express");
    const Routa = express.Router();

    require('dotenv').config();
    const puppet = require('./store/puppetAlj');
    const puppett = require('./store/puppetCnn');
    //
    
    //
    let empty = null;
    

    let source = {
            docs: "https://www.aljazeera.com/documentaries/",
            africa: "https://edition.cnn.com/africa",
            trending: "https://www.aljazeera.com/",
            news: "https://www.aljazeera.com/topics/regions/africa.html",
        };
        //

    const Puppet = puppet.Scrapper;

    const dataNews = new Puppet(source.news);
    dataNews.puppet();

    //////
    const Puppett = puppett.Scrapper;
    const dataT = new Puppett(source.africa, "Africa");
    dataT.puppet();


    ///
    Routa.get('/buzzz', (req, res) => {
        res.send({

            "aljNews": dataNews.data,
            "cnn": dataT.data

        });
    })

    module.exports = Routa;
})();
const express = require('express');
const cnnRouta = express.Router();
require('dotenv').config()
const puppet = require('./store/puppetCnn');
//
process.setMaxListeners(Infinity);
//
let sources = {
        world: "https://edition.cnn.com/world",
        africa: "https://edition.cnn.com/africa",
        tech: "https://edition.cnn.com/business/tech",
        health: "https://edition.cnn.com/health",
        business: "https://edition.cnn.com/business",
    }
    //
const Puppet = puppet.Scrapper;
//one
const One = new Puppet(sources.world);
One.puppet();
//Two
const Two = new Puppet(sources.africa);
Two.puppet();
//Three
const Three = new Puppet(sources.tech);
Three.puppet();
//Four
const Four = new Puppet(sources.health);
Four.puppet();
//Five
const Five = new Puppet(sources.business);
Five.puppet();
//



/////////////
cnnRouta.get('/cnn', (req, res) => {
    res.send({

        "world": One.data,
        "africa": Two.data,
        "tech": Three.data,
        "health": Four.data,
        "business": Five.data
    });

})

module.exports = cnnRouta;
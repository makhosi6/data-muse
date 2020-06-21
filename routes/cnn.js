require('dotenv').config();
const cron = require("node-cron");
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
const One = new Puppet(sources.world);
const Two = new Puppet(sources.africa);
const Three = new Puppet(sources.tech);
const Four = new Puppet(sources.health);
const Five = new Puppet(sources.business);

//

cron.schedule("0 */6 * * *", () => {

    (() => {
        console.log('\x1b[46m%s\x1b[0m', "CNN fire at:" + Date());
        //one
        One.puppet();
        //Two
        Two.puppet();
        //Three
        Three.puppet();
        //Four
        Four.puppet();
        //Five
        Five.puppet();
        //////////////
    })();
});
//.
module.exports = {

    "world": One.data,
    "africa": Two.data,
    "tech": Three.data,
    "health": Four.data,
    "business": Five.data
}
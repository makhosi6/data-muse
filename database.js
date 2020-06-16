const mongoose = require('mongoose');
require('dotenv').config();

mongoose.connect(process.env.DATABASE, { useNewUrlParser: true, useUnifiedTopology: true }, (err, db) => {
    if (err) throw err;
    var dbo = db.db("museDB");
    console.log(process.env.DATABASE)
    console.log("DB Connected");

    var myobj = [{
        "url": "https://www.sabcnews.com/sabcnews/saru-working-out-ways-to-get-rugby-back-on-track/",
        "headline": "SARU working out ways to get rugby back on track",
        "lede": "SARU says it is hard at work to get both international and domestic rugby back up and running, as soon as possible.",
        "thumbnail": "https://www.sabcnews.com/sabcnews/wp-content/uploads/2020/06/sabc-news-Jurie-Roux-SARU.jpg",
        "category": "sport",
        "catLink": null,
        "tag": "sport",
        "images": "gdgd.com/jos/",
        "isVid": true,
        "vidLen": null,
        "author": null,
        "date": "9 June 2020, 1:11 PM"
    }];
    dbo.collection("datamock").update({}, { $set: { "politics.$[]": myobj } }, { multi: true }, function(err, res) {
        if (err) throw err;
        console.log('data insected');
        db.close();
    });
})
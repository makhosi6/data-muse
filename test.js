var MongoClient = require('mongodb').MongoClient;
require('dotenv').config();

MongoClient.connect('mongodb://127.0.0.1:27017/', { useNewUrlParser: true, useUnifiedTopology: true }, function(err, db) {
    if (err) throw err;
    var dbo = db.db("museDB");
    console.log("DB Connected");

    var myobj = [{
        "url": "https://www.sabcnews.com/sabcnews/a-decade-on-south-africa-insists-world-cup-worth-investment/",
        "headline": "A decade on, South Africa insists World Cup worth investment",
        "lede": "Thursday marks 10 years since South Africa hosted a FIFA World Cup highly charged with symbolism but dogged by questions about the wisdom of spending billions on a sports event that might have been better used elsewhere.",
        "thumbnail": "https://www.sabcnews.com/sabcnews/wp-content/uploads/2020/06/SABC-News-2010FIFA-R.jpg",
        "category": "sport",
        "catLink": null,
        "tag": "sport",
        "images": "",
        "isVid": true,
        "vidLen": null,
        "author": null,
        "date": "9 June 2020, 3:29 PM"
    }];
    dbo.collection("datamock").insertMany(myobj, function(err, res) {
        if (err) throw err;
        console.log('data insected');
        db.close();
    });
});


// let obj = {
//     one: [1, 2, 3, 3, 45, 5],
//     two: [12, 43, 5, 556, 66, 6]
// }
// let big = [];

// obj.one.map((e) => big.push(e)); //one
// obj.two.map((e) => big.push(e)); //two

//big OUTPUT  = [1, 2, 3, 3, 45, 5, 12, 43, 5, 556, 66, 6]


/*
();
    
{
    url,
    headline,
    lede,
    thumbnail,
    //
    src,
    category,
    catLink,
    tag,
    //
    images,
    //
    isVid,
    vidLen,
    //
    author,
    date
}

*/
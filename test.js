var MongoClient = require("mongodb").MongoClient;
require("dotenv").config();

MongoClient.connect(
  "mongodb://127.0.0.1:27017/",
  { useNewUrlParser: true, useUnifiedTopology: true },
  function (err, db) {
    if (err) throw err;
    var dbo = db.db("museDB");
    console.log("DB Connected");

    var myobj = [
      {
        url:
          "https://www.sabcnews.com/sabcnews/a-decade-on-south-africa-insists-world-cup-worth-investment/",
        headline:
          "A decade on, South Africa insists World Cup worth investment",
        lede:
          "Thursday marks 10 years since South Africa hosted a FIFA World Cup highly charged with symbolism but dogged by questions about the wisdom of spending billions on a sports event that might have been better used elsewhere.",
        thumbnail:
          "https://www.sabcnews.com/sabcnews/wp-content/uploads/2020/06/SABC-News-2010FIFA-R.jpg",
        category: "sport",
        catLink: null,
        tag: "sport",
        images: "",
        isVid: true,
        vidLen: null,
        author: null,
        date: "9 June 2020, 3:29 PM",
      },
    ];
    dbo.collection("mockdata").insertMany(myobj, function (err, res) {
      if (err) throw err;
      console.log("data insected");
      db.close();
    });
  }
);

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
     url_src,
    src_logo,
    src_name
    category,
    catLink,
    tag,
    //
    images, (LAZY LOAD -> https://afarkas.github.io/lazysizes/index.html)
    //
    isVid,
    vidLen,
    //
    author,
    date,
    type
}

*/
/*
CATEGORY
trends
sport
business
politics

TYPES
 card
 title-only
 study
 //
 strip
 trend
    
*/
/*
[

id,
url,
headline,
lede,
thumbnail,
category,
catLink,
images,
//
key,
label,
//
subject,
format,
about,
//
src_name,
src_url,
src_logo,
//
isVid,
vidLen,
//
type,
tag,
tags,
//
author,
authors,
date



]*/

let obj = {
  source: "http://www.bbc.com/health",
  main: {
    number_logs: 3,
    error: [
      {
        current: "Mon Jan 18 2021 20:13:55",
        data: null,
        error: "Missing selector",
      },
    ],
  },
  latest: {
    number: 89,
    current: "Mon Jan 18 2021 20:13:55",
    data: null,
    error: "Missing selector",
  },
  logs: [
    {
      current: "Mon Jan 18 2021 20:13:55",
      data:
        '{"id":"50s8n9tpafs5tnl1hs2lap1vqtri1kw6","url":"https://citizen.co.za/news/south-africa/local-news/2421175/r12m-bronkhorstspruit-hospital-upgrade-makes-no-sense/","headline":"R12m Bronkhorstspruit hospital upgrade ‘makes no sense’","lede":"Last June, BMW Germany announced the company would partner with the government to upgrade…","thumbnail":"https://citizen.co.za/wp-content/uploads/2018/02/bronks-389x259.jpg?x79228","category":"sport","catLink":"local news","images":null,"key":null,"label":null,"subject":null,"format":null,"about":null,"src_name":"Citizen","src_url":"https://citizen.co.za","src_logo":"https://citizen.co.za/wp-content/themes/citizen-v5-2/images/citizen_logo_footer_v2.png","isVid":false,"vidLen":null,"type":"strip","tag":"local news","tags":null,"author":null,"authors":null,"date":null}',
      error: null,
    },
    {
      current: "Mon Jan 18 2021 20:13:55",
      data: null,
      error: "Missing selector",
    },
  ],
};

let o = {
main:{
  latest:{
    number:0,
  },
  logs:[]
},
children: {
  latest:{
    number:0
  },
  logs:[

  ]
}


}
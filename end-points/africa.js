const express = require("express");
const africaRouta = express.Router();
//
const alj = require("../sources/alj");
const bbc = require("../sources/bbc");
const bloomberg = require("../sources/bloomberg");
const cnn = require("../sources/cnn");


let africa = [];

///
alj.africa.map((a) => africa.push(a));
//
bbc.africa.map((a) => africa.push(a));
//
bloomberg.news.map((a) => africa.push(a));
//
cnn.africa.map((a) => africa.push(a));
//
africaRouta.get("/africa", (req, res) => {
    res.send({
        africa
    });
});
module.exports = africaRouta;
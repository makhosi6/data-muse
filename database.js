const mongoose = require('mongoose');
require('dotenv').config();

mongoose.connect(process.env.DATABASE, { useNewUrlParser: true, useUnifiedTopology: true }, () => {
    console.error('connected to DB');
    console.trace('connected to DB');
    console.time('connected to DB');

}).
catch(err => console.trace(err.reason));
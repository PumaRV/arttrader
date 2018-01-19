'use strict';

const express = require('express');
const app = express();

app.use(express.static('./frontend/build'));

app.listen(80, function() {
    console.log('I hate frontend frameworks');
});
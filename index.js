'use strict';

const express = require('express');
const parser = require('body-parser');
const sanitize = require('express-sanitize-escape');
const fxdata = require('./lib/fxdata');

const app = express();

app.use(parser.urlencoded({
    extended: true
}));
app.use(sanitize.middleware());
app.use(express.static(__dirname + '/frontend/build'));

app.post('/ticks/add', (request, respose) => {

    //at this point body params had been sanitized.
    const bid = request.body.bid;
    const ask = request.body.ask;
    const time = request.body.time;
    const pair = request.body.pair;
    const ema20 = request.body.ema20;

    const result = fxdata.saveTick(bid, ask, time, pair, ema20);
    respose.send(result.status);
});

app.get('/ticks/:currency/:size', (request, response) => {
  const currency = request.params.currency;
  const size = request.params.size;
  
  fxdata.getHourlyTicks(currency, size, (error, results) => {
    response.send(results);
  });
});

app.get('/last/:currency', (request, response) => {
  const currency = request.params.currency;
  fxdata.getMostRecentTicks(currency, (error, results) => {
    response.send(results);
  });
});

app.listen(80, function() {
});

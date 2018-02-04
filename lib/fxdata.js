'use strict';

const mysql = require('promise-mysql');

const pool = mysql.createPool({
  connectionLimit: 10,
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

const internals = {
  getCandle: (currency, dimensional, dimensionalValue) => {
    const previous = dimensionalValue -1; 
    const query = 'SELECT ' +
                  '(SELECT (t0.ask + t0.bid)/2 FROM tick t0 WHERE t0.id=mmt.min_id) open, ' +
                  '(SELECT (t0.ask + t0.bid)/2 FROM tick t0 WHERE t0.id=mmt.max_id) close, ' +
                  '(mmt.min_ask + mmt.min_bid)/2 low, ' +
                  '(mmt.max_ask + mmt.max_bid)/2 high, ' +
	                '(SELECT t0.time FROM tick t0 WHERE t0.id=mmt.min_id) open_time, ' +
									'(SELECT t0.ema20 FROM tick t0 WHERE t0.id=mmt.max_id) ema20 ' +
                'FROM ( ' +
                  'SELECT MIN(tt.id) min_id, MAX(tt.id) max_id, MIN(tt.ask) min_ask, MAX(tt.ask) max_ask, MIN(tt.bid) min_bid, MAX(tt.bid) max_bid ' +
                  'FROM ( ' +
                    'SELECT t.id, t.ask, t.bid ' +
                    'FROM tick t, vw_time vt ' +
                    'WHERE ' +
                      't.pair = \'' + currency + '\' '  +
                      'AND t.time between (vt.n - interval ' + dimensionalValue + ' ' + dimensional+ ') and (vt.n - interval  ' + previous + ' ' + dimensional + ') ' +
                  ') tt ' +
                ') mmt; ';
    return pool.query(query);
  },
	getLastCandle: (currency) => {
		console.log("pumbass");
    const query2 = 'SELECT ' +
                  '(SELECT (t0.ask + t0.bid)/2 FROM tick t0 WHERE t0.id=mmt.min_id) open, ' +
                  '(SELECT (t0.ask + t0.bid)/2 FROM tick t0 WHERE t0.id=mmt.max_id) close, ' +
                  '(mmt.min_ask + mmt.min_bid)/2 low, ' +
                  '(mmt.max_ask + mmt.max_bid)/2 high, ' +
	                '(SELECT t0.time FROM tick t0 WHERE t0.id=mmt.min_id) open_time, ' +
									'(SELECT t0.ema20 FROM tick t0 WHERE t0.id=mmt.max_id) ema20 ' +
                'FROM ( ' +
                  'SELECT MIN(tt.id) min_id, MAX(tt.id) max_id, MIN(tt.ask) min_ask, MAX(tt.ask) max_ask, MIN(tt.bid) min_bid, MAX(tt.bid) max_bid ' +
                  'FROM ( ' +
                    'SELECT t.id, t.ask, t.bid ' +
                    'FROM tick t, vw_time vt ' +
                    'WHERE ' +
                      't.pair = \'' + currency + '\' '  +
                      'AND t.time between vt.n  and vt.now ' +
                  ') tt ' +
                ') mmt; ';
    return pool.query(query2);
  }
}

const saveTick = (bid, ask, time, pair, ema20) => {
  const result = pool.query('INSERT INTO tick(bid, ask, time, pair, ema20) VALUES(?, ?, ?, ?, ?)', [bid, ask, time, pair, ema20], (error, results, fields) => {
    if (error) {
      console.log(error);
    } else {
      const queryResult = {
        status: "ok"
      };
      return queryResult;
    }
  });

  return result;
}

const getLastDayTicks = (callback) => {
  return 'hola';
}

const getHourlyTicks = async(currency, size, callback) => {
  const dimensional = 'hour';
  const dimensionalValue = size;
  const resultSet = [];
  for (var i = size; i > 0; i--) {
    const candle = await internals.getCandle(currency, dimensional, i);
    resultSet.push(candle[0]);
  }
  callback(null, resultSet);
};

const getMostRecentTicks = async(currency, callback) => {
  const candle = await internals.getLastCandle(currency);
  callback(null, candle[0]);
};

module.exports = {
  saveTick,
  getLastDayTicks,
  getHourlyTicks, 
	getMostRecentTicks
}
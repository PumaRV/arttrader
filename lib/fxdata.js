'use strict';

const mysql = require('mysql');
const pool = mysql.createPool({
    connectionLimit: 10,
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

const saveTick = (bid, ask, time, pair, ema20) => {
    const result = pool.query('INSERT INTO tick(bid, ask, time, pair, ema20) VALUES(?, ?, ?, ?, ?)', [bid, ask, time, pair, ema20], (error, results, fields) => {
        if(error) {
            console.log(error);
        } else {
          const queryResult = {
              status: "ok"
          };
          return  queryResult;
        }
    });
    
    return result;
}

const getLastDayTicks = (callback) => {
  const query = 'select '+
                    'min(cast(bid as decimal(6,5))) as low, ' +
                    'max(cast(bid as decimal(6,5))) as high, ' +
                    '(select bid from tick limit 1 offset 0) as open, ' +
                    '(select bid from tick limit 1 offset 70) as close ' +
                'from ' +
                    '(select bid from tick where time between now() - interval 2 day and now() limit 70 offset 0) as t1;';
  
  const result = pool.query(query, (error, results, fields) => {
      callback(error, results);
  });
}

module.exports = {
    saveTick,
    getLastDayTicks
}
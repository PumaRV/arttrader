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
        }
        return {
            bid: bid,
            ask: ask,
            time: time,
            pair: pair,
            ema20: ema20,
            status: "ok"
        }
    });

    return result;
}

module.exports = {
    saveTick
}
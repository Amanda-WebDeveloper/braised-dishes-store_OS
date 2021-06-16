const mysql = require('mysql');

const config = {
    host: '127.0.0.1',
    user: '',
    password: '',
    port: '3306',
    ssl: true,
    database: ''
};

let connPool = mysql.createPool(config);




module.exports = connPool;
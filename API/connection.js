const mysql = require('mysql');

const connection = mysql.createConnection({
    host: '127.0.0.1',
    user: 'root',
    password: '',
    database: 'amazonia'
});

//Check connect 
connection.connect(error => {
    (error) ? console.log(error): console.log('Base de datos conectada');
});
module.exports = connection;
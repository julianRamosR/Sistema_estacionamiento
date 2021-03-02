const express = require('express');
const bodyParser = require('body-parser')
const app = express();
const _ = require('underscore');
const fs = require('fs');
const PORT = process.env.PORT || 5000;
const path = require('path');
const loging = require('./rutes/login.js');
const registro = require('./rutes/Registros/registro.js');
const historial = require('./rutes/historial/historial');


app.use(bodyParser.json());

//Agregar al acceso al CORS 
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
    next();
});

app.listen(PORT, () => {
    console.log(`Server en el puerto ${PORT}`);
});


//Login
app.use('/login', loging);

//Registro
app.use('/registro/', registro);

//Historial
app.use('/historial/', historial);
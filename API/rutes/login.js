const express = require('express');
const router = express.Router();
const connection = require('../connection.js');

//Validacion del inicio de sesión
router.post('/validationlogin/', (req, res) => {
    const { pass, user } = req.body;
    const sql = `SELECT Id, Name, Lastname, Access FROM users WHERE user = '${user}' and pass ='${pass}'`;
    connection.query(sql, (error, results) => {
        /*Trabajo de error*/
        if (error) {
            console.log('Hubo un error en la base de datos');
            res.json({
                text: 'Hubo un error en la base de datos',
                value: false
            })
        }
        if (results.length > 0) {
            if (results[0].Access === "True") {
                res.json({
                    userInfo: results[0],
                    value: true
                })
            } else {
                res.json({
                    value: false
                })
            }
        } else {
            res.json({
                value: false
            })
        }


    });
});

//Validación de la existencia de un usuario
router.post('/user/', (req, res) => {
    const { id } = req.body;
    const sql = `SELECT Access FROM users WHERE Id = '${id}'`;

    connection.query(sql, (error, results) => {
        /*Trabajo de error*/
        if (error) {
            console.log('Hubo un error en la base de datos');
            res.json({
                text: 'Hubo un error en la base de datos',
                value: false
            })
        }
        if (results.length > 0) {
            if (results[0].Access === "True") {
                res.json({
                    value: true
                })
            } else {
                res.json({
                    value: false
                })
            }
        } else {
            res.json({
                value: false
            })
        }
    });
    console.log(req.body);
})
module.exports = router;
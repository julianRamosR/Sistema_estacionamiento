const express = require('express');
const router = express.Router();
const uniqid = require('uniqid');
const connection = require('../../connection.js');

router.get('/get/', (req, res) => {

    const sql = `
                        SELECT * FROM historial ORDER BY ExitDate DESC `;

    connection.query(sql, (error, results) => {
        /*Trabajo de error*/
        if (error) {
            console.log('Hubo un error en la base de datos');
            res.json({
                text: 'Hubo un error en la base de datos',
                value: false
            })
        }
        /*Devolviendo resultados*/
        console.log(results);
        if (results.length) {

            res.json({
                value: true,
                results: results
            })
        } else {
            res.json({
                text: 'No se encontro resultado',
                value: false
            })
        }
    });
});

router.get('/get/?:ID', (req, res) => {
    const { ID } = req.params;
    const sql = `
                        SELECT * FROM historial WHERE ID = '${ID}'
                        `;

    connection.query(sql, (error, result) => {
        /*Trabajo de error*/
        if (error) {
            console.log('Hubo un error en la base de datos');
            res.json({
                text: 'Hubo un error en la base de datos',
                value: false
            })
        }
        /*Devolviendo resultados*/
        if (result.length > 0) {
            console.log(result[0].Date);
            res.json({
                value: true,
                result: result[0]
            })
        } else {
            res.json({
                value: false
            })
        }
    });
});







module.exports = router;
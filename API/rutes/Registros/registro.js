const express = require('express');
const router = express.Router();
const uniqid = require('uniqid');
const connection = require('../../connection.js');
const WhatsAppWeb = require('baileys')

const client = new WhatsAppWeb()

//Actualizar el estado de un esapacio de administradores para espacio ocupado
function activateStateAdmin(ID) {
    if (ID) {
        const sql = `UPDATE espacios SET ? WHERE ID = '${ID}'`
        const data = {
            ADMIN: 1
        }
        connection.query(sql, data, error => {
            /*Trabajo de error*/
            if (error) {
                console.log(error);
                return false;
            } else {
                return true;
            }
        });

    } else {
        return false;
    }
}

//Actualizar el estado de un esapacio de administradores para espacio desocupado
function inactivateStateAdmin(ID) {
    if (ID) {
        const sql = `UPDATE espacios SET ? WHERE ID = '${ID}'`
        const data = {
            ADMIN: 0
        }
        connection.query(sql, data, error => {
            /*Trabajo de error*/
            if (error) {
                console.log(error);
                return false;
            } else {
                return true;
            }
        });

    } else {
        return false;
    }
}
//Actualizar el estado de un esapacio de CLIENTEiantes para espacio ocupado
function activateStatCLIENTE(ID) {
    if (ID) {
        const sql = `UPDATE espacios SET ? WHERE ID = '${ID}'`
        const data = {
            CLIENTE: 1
        }
        connection.query(sql, data, error => {
            /*Trabajo de error*/
            if (error) {
                console.log('Hubo un error en la base de datos');
                return false
            } else {
                return true
            }
        });

    } else {
        return false

    }
}
//Actualizar el estado de un esapacio de CLIENTEiantes para espacio desocupado
function inactivateStatCLIENTE(ID) {
    if (ID) {
        const sql = `UPDATE espacios SET ? WHERE ID = '${ID}'`
        const data = {
            CLIENTE: 0
        }
        connection.query(sql, data, error => {
            /*Trabajo de error*/
            if (error) {
                console.log('Hubo un error en la base de datos');
                return false;
            } else {
                return true;
            }
        });

    } else {
        res.json({
            value: false
        })
    }
}

router.get('/conectar', (req, res) => {
    client.connect()
        .then(([user, chats, contacts, unread]) => {
            res.json({ mensaje: 'Autenticación exitosa' });
        })
        .catch(err => console.log(err));
});


//Enviar un registro nuevo
router.post('/', (req, res) => {
    const { Name, Document, Placa, VType, Place, Phone, Bloque } = req.body;
    console.log(req.body);
    if (Name && Document && Placa && VType && Place && Phone && Bloque) {
        let sql = `INSERT INTO registros SET ?`;
        const usersOBJ = {
            ID: uniqid(),
            Name: Name,
            Document: Document,
            Placa: Placa,
            VType: VType,
            Bloque: Bloque,
            Place: Place,
            Phone: `57${Phone}`
        }
        connection.query(sql, usersOBJ, error => {
            if (error) {
                console.log(error)
                res.json({ value: false });
            } else {
                options = {
                    quoted: null,
                    timestamp: new Date()
                }
                console.log(usersOBJ.Phone);
                const message = `Hola ${usersOBJ.Name}, tu vehículo ha sido registrado de manera exitosa en el sistema de parqueo, este es tu espacio "${usersOBJ.Place}"`;
                client.sendTextMessage(`${usersOBJ.Phone}@s.whatsapp.net`, message, options)
                    .then(value => {
                        console.log(value);
                    });
                if (usersOBJ.Bloque === 'ADMIN') {
                    activateStateAdmin(usersOBJ.Place);
                    res.json({ value: true, ID: usersOBJ.ID });
                } else if (usersOBJ.Bloque === 'CLIENTE') {
                    activateStatCLIENTE(usersOBJ.Place);
                    res.json({ value: true, ID: usersOBJ.ID });
                }
            }
        });
    } else {
        res.json({
            value: false
        })
    }
});
//Consultar un registro activo
router.get('/get/', (req, res) => {

    const sql = `
                        SELECT * FROM registros ORDER BY Date DESC `;

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
//Consultar un registro activo por ID
router.get('/get/?:ID', (req, res) => {
    const { ID } = req.params;
    const sql = `
                        SELECT * FROM registros WHERE ID = '${ID}'
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
//Enviar al hitorial un registro
router.post('/history/', (req, res) => {
    const { date, ID, Name, Document, Placa, VType, Place, userID, Phone, Bloque } = req.body;
    console.log(req.body);
    if (date && ID && Name && Phone && Document && Placa && VType && Place && userID && Bloque) {
        let sql = `INSERT INTO historial SET ?`;
        const usersOBJ = {
            ID: ID,
            Name: Name,
            Document: Document,
            Placa: Placa,
            VType: VType,
            Bloque: Bloque,
            Place: Place,
            Phone: Phone,
            EntryDate: date,
            userid: userID
        }
        connection.query(sql, usersOBJ, error => {
            if (error) {
                console.log(error)
                res.json({ value: false });
            } else {
                options = {
                    quoted: null,
                    timestamp: new Date()
                }
                const message = `Hola ${usersOBJ.Name}, tu vehículo ha sido retirado del parqueadero exitosamente, en caso de haber un error comuniquese inmediantemente con el centro de atención 5472517`
                console.log(usersOBJ.Phone);
                client.sendTextMessage(`${usersOBJ.Phone}@s.whatsapp.net`, message, options)
                    .then(value => {
                        console.log(value);
                    });
                if (usersOBJ.Bloque === 'ADMIN') {
                    inactivateStateAdmin(usersOBJ.Place);
                    res.json({ value: true, ID: usersOBJ.ID });
                } else if (usersOBJ.Bloque === 'CLIENTE') {
                    inactivateStatCLIENTE(usersOBJ.Place);
                    res.json({ value: true, ID: usersOBJ.ID });
                }
            }
        });
    } else {
        res.json({
            value: false
        })
    }
});
//Eliminar un registro
router.delete('/?:ID', (req, res) => {
    const { ID, } = req.params;
    console.log(req.params);
    if (ID) {
        let sql = `DELETE FROM registros WHERE id = '${ID}'`;
        connection.query(sql, error => {
            if (error) {
                console.log(error)
                res.json({ value: false });
            } else {
                res.json({ value: true });
            }
        });
    } else {
        res.json({
            value: false
        })
    }
});
//obtener la lista de espacios disponibles para administradores
router.get('/espacios/admin', (req, res) => {
    const sql = 'SELECT ID FROM espacios WHERE ADMIN = 0';

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
        if (results.length > 0) {
            res.json({
                value: true,
                results: results
            })
        } else {
            res.json({
                value: false
            })
        }
    });
});
//Actualizar el estado de un esapacio de administradores para espacio inactivo
router.put('/espacios/admin/space/activate', (req, res) => {
    const { ID } = req.body
    if (ID) {
        const sql = `UPDATE espacios SET ? WHERE ID = '${ID}'`
        const data = {
            ADMIN: 1
        }
        connection.query(sql, data, error => {
            /*Trabajo de error*/
            if (error) {
                console.log('Hubo un error en la base de datos');
                res.json({
                    text: 'Hubo un error en la base de datos',
                    value: false
                })
            } else {
                res.json({
                    value: true
                })
            }
        });

    } else {
        res.json({
            value: false
        })
    }
});
//LISTA DE CLIENTEIANTES 

//obtener la lista de espacios disponibles para CLIENTEiantes
router.get('/espacios/cliente', (req, res) => {
    const sql = 'SELECT ID FROM espacios WHERE CLIENTE = 0';

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
        if (results.length > 0) {
            res.json({
                value: true,
                results: results
            })
        } else {
            res.json({
                value: false
            })
        }
    });
});



module.exports = router;
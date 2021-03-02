const tableBody = document.getElementById('tabla-historial');
const bodyPage = document.querySelector('body');

//Event Search
document.querySelector('#document').addEventListener('keyup', () => buscarTabla());

//Esta funcion crea la tabla de los historial activos
(async function gethistorial() {
    const URL = `${BaseURL}historial/get/`
    const consult = await fetch(URL);
    const result = await consult.json();
    if (result.value) {
        result.results.map(element => {
            createEntry(element);
        });
    }
})();

//Consultar un usuario por id 
async function EntryConsult(ID) {
    const url2 = `${BaseURL}historial/get/${ID}`
    const cosult2 = await fetch(url2)
    const results2 = await cosult2.json();
    const result = await results2.result;
    return result;
}
//Esta Funcion crea una nueva entrada en la tabla de datos.
const createEntry = (element) => {
    const row = document.createElement('tr');
    row.innerHTML = `
    <td>${element.Document} </td>
    <td>${element.VType} </td>
    <td>${element.Placa} </td>
    <td>
       <button onclick="openEntry('${element.ID}')">Inspeccionar</button>
    </td>`;
    tableBody.appendChild(row)
}

//Esta funcion sirve para cerrar el modalk
function closer(id) {
    const element = document.getElementById(id);
    element.style.display = "none"
    bodyPage.style.overflow = 'auto';

}

//Abre la información de un historial
async function openEntry(ID) {
    const modalBody = document.getElementById('modal-body');
    const modal = document.getElementById('Modal');
    let result = await EntryConsult(ID);
    let fecha = new Date(result.EntryDate)
    let fecha2 = new Date(result.ExitDate)
    let options = { weekday: "long", year: "numeric", month: "long", day: "numeric" };
    modalBody.innerHTML = `<label><b>Nombre:</b> ${result.Name}</label>
                <label><b>Documento:</b> ${result.Document}</label>
                <label><b>Celular:</b> ${result.Phone}</label>
                <label><b>Tipo:</b> ${result.VType}</label>
                <label><b>Placa:</b> ${result.Placa}</label>
                <label><b>Posición:</b> ${result.Place}</label>
                <label><b>Fecha y hora de Entrada:</b> <span data-type="datetime">${result.EntryDate}</span></label>
                <label><b>Fecha y hora de Salida:</b> <span data-type="datetime">${fecha2.toLocaleString("es-ES", options)} - ${fecha2.toLocaleTimeString()}</span></label>
                <div class="button">
                

                <button type="button" onclick="closer('Modal')">CERRAR</button>
            </div>
                `
    modal.style.display = 'flex';
    bodyPage.style.overflow = 'hidden';
}

//Elimina un historial
async function eliminar(ID) {
    let url = `${BaseURL}historial/${ID}`
    let consulta = await fetch(url, {
        method: 'DELETE', // or 'PUT'
        headers: {
            'Content-Type': 'application/json'
        }
    })
    let results = await consulta.json();
    return results.value
}

//Esta funcion envia los datos al hitorial de historial
async function EntryHistory(ID) {
    let URL = `${BaseURL}historial/history/`

    let historial = await EntryConsult(ID);
    //La información del usuario
    const userInfo = JSON.parse(sessionStorage.getItem('user'));
    //Modificar la fecha
    let fecha = new Date(historial.Date);
    let data = {
        ID: historial.ID,
        Name: historial.Name,
        Document: historial.Document,
        Placa: historial.Placa,
        Phone: historial.Phone,
        VType: historial.VType,
        Bloque: historial.Bloque,
        Place: historial.Place,
        date: fecha.toLocaleString({
            format: 'dd-mm-yyyy'
        }),
        userID: userInfo.Id,
    };
    //Enviamos los datos a la base de datos 
    let consult = await fetch(URL, {
        method: 'POST', // or 'PUT'
        body: JSON.stringify(data), // data can be `string` or {object}!
        headers: {
            'Content-Type': 'application/json'
        }
    });
    let result = await consult.json();
    return result.value;
}

//Este se encarga de dar¿ informacion al usaurio
async function entregar(ID) {
    let historial = await EntryHistory(ID);
    let eliminarValue = await eliminar(ID);
    console.log(historial);
    console.log(eliminarValue);
    if (historial && eliminarValue) {
        swal({
            text: `historial entregado correctamente`,
            button: 'Volver'
        }).then(value => {
            location.reload();
        })
    }
}

function buscarTabla() {
    const searchValue = document.querySelector('#document').value;
    const tableLine = (document.querySelector('#tabla-historial')).querySelectorAll('tr');
    for (let i = 0; i < tableLine.length; i++) {
        var count = 0;
        const lineValues = tableLine[i].querySelectorAll('td');
        for (let j = 0; j < lineValues.length - 1; j++) {
            if ((lineValues[j].innerHTML).startsWith(searchValue)) {
                count++;
            }
        }
        if (count > 0) {
            tableLine[i].style.display = '';
        } else {
            tableLine[i].style.display = 'none';
        }
    }
}

function salir() {
    swal({
        text: '¿Estas seguro que quieres salir?',
        buttons: true
    }).then(value => {
        if (value) {
            sessionStorage.removeItem('user')
            window.location.href = '../Index.html'
        }
    })

}
//Esta funcion registra un usuario en la base de datos
async function Registrar() {
    const BaseURL = "http://localhost:5000/"
    const URL = `${BaseURL}registro/`
    const name = document.getElementById('name').value;
    const Udocument = document.getElementById('document').value;
    const placa = document.getElementById('placa').value;
    const VType = document.getElementById('Tipo').value;
    const Phone = document.getElementById('phone').value;
    const place = document.getElementById('place1').value;
    const place2 = document.getElementById('place2').value;
    const modal = document.getElementById('Modal');
    const modalBody = document.getElementById('modal-body');
    const bodyPage = document.querySelector('body');


    const data = {
        Name: name,
        Document: Udocument,
        Placa: placa,
        VType: VType,
        Bloque: place,
        Place: place2,
        Phone: Phone,
    }
    const consult = await fetch(URL, {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
            'Content-Type': 'application/json'
        }
    })
    const results = await consult.json();
    if (!results.value) {

        if (VType === "Carro")
            swal({
                text: `No se registro de manera correcta el ${VType}`,
                button: 'Volver'
            })
        else {
            swal({
                text: `No se registro de manera correcta la ${VType}`,
                button: 'Volver'
            })
        }
    } else {
        const URL2 = `${BaseURL}registro/get/${results.ID}`
        console.log(URL2);
        const cosult2 = await fetch(URL2)
        const results2 = await cosult2.json();
        const result = await results2.result;
        let fecha = new Date(result.Date)
        let options = { weekday: "long", year: "numeric", month: "long", day: "numeric" };
        modalBody.innerHTML = `<label><b>Nombre:</b> ${result.Name}</label>
                    <label><b>Documento:</b> ${result.Document}</label>
                    <label><b>Tipo:</b> ${result.VType}</label>
                    <label><b>Placa:</b> ${result.Placa}</label>
                    <label><b>Celular:</b> ${result.Phone}</label>
                    <label><b>Posición:</b> ${result.Place}</label>
                    <label><b>Fecha y hora de Entrada:</b> ${fecha.toLocaleString("es-ES", options)} - ${fecha.toLocaleTimeString()}</label>`
        modal.style.display = 'flex';
        bodyPage.style.overflow = 'hidden';
        //Limpiamos los valores
        document.getElementById('name').value = '';
        document.getElementById('document').value = '';
        document.getElementById('placa').value = '';
        document.getElementById('Tipo').value = '';
        document.getElementById('phone').value = '';
        //Actualizamos la lista de espacios disponibles
        changeSpaces();
    }

}
//Esta funcion cierra los modales abiertos de toda la aplicación
function closer(id) {
    const bodyPage = document.querySelector('body');
    const element = document.getElementById(id);
    element.style.display = "none"
    bodyPage.style.overflow = 'auto';
}
//Esta funcipon le permite a los usuarios salir del aplicativo
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
//Esta funcion actuliza la lista de espacios disponibles que hay en el paqueadero
async function changeSpaces() {
    //Ponemos la url en el cual se va a hacer la consulta
    const URL = `${BaseURL}registro/espacios/admin`;
    const URL2 = `${BaseURL}registro/espacios/cliente`;
    //Asignamos el select del bloque a una constate
    const bloque = document.getElementById('place1');
    //Ahora validamos que si el valor es igual a admin consultamos en la api sobre el admin
    if (bloque.value == 'ADMIN') {
        //Asignamos el select del espacio a una constante
        const place = document.getElementById('place2');
        place.innerHTML = ''
        let consult = await fetch(URL);
        let results = await consult.json();
        if (results.value && results.results.length > 0) {
            //Asigno los valores de la respuesta de la API a una constante
            const places = results.results;
            //Ahora por cada valor que tiene la espuesta de la api ponemos un espacio en el select
            places.map(element => {
                var option = document.createElement("option");
                option.text = element.ID;
                option.value = element.ID;
                //ahora por cada opción
                place.appendChild(option);
            });
        }
    } else {
        //Asignamos el select del espacio a una constante
        const place = document.getElementById('place2');
        place.innerHTML = ''
        let consult = await fetch(URL2);
        let results = await consult.json();
        if (results.value && results.results.length > 0) {
            //Asigno los valores de la respuesta de la API a una constante
            const places = results.results;
            //Ahora por cada valor que tiene la espuesta de la api ponemos un espacio en el select
            places.map(element => {
                var option = document.createElement("option");
                option.text = element.ID;
                option.value = element.ID;
                //ahora por cada opción
                place.appendChild(option);
            });
        }
    }
}


//Validar el formato de la placa
function soloLetras(e) {
    console.log(e);
    const key = e.keyCode || e.which;
    const teclas = e.key;
    const letrasMayus = "ABCDEFGHIJQLMNOPQRSTUVWXYZabcdefghijklmnoprstuvwxyz";
    let especiales = [0, 13];
    let teclas_especiales = false;
    for (let i in especiales) {
        if (key == especiales[i]) {
            teclas_especiales = true;
        }
    }
    if (letrasMayus.indexOf(teclas) == -1 && !teclas_especiales) {
        return false;
    }
}

function soloNum(e) {
    const key = e.keyCode || e.which;
    if (window.event) {
        keynum = e.keyCode
    } else {
        keynum = e.which
    }
    if (keynum > 47 && keynum < 58 || keynum == 13) {
        return true;
    } else {
        return false;
    }
}

function putdash(e) {
    const placa = document.getElementById('placa').value;
    let newValue = `${placa}-`;
    document.getElementById('placa').value = newValue.toUpperCase();
}

function validatePlacaCarr(e) {
    const placa = document.getElementById('placa').value;
    if (placa.length < 3) {
        let soloLetraslet = soloLetras(e);
        if (soloLetraslet === false) {
            return false;
        }
    } else if (placa.length === 3) {
        putdash(e);
    } else if (placa.length > 3 && placa.length < 7) {
        let soloNumlet = soloNum(e);
        console.log(soloNumlet);
        if (soloNumlet === false) {
            return false;
        }
    } else {
        const placa = document.getElementById('placa').value;
        let newValue = placa;
        document.getElementById('placa').value = newValue.toUpperCase();
        return false;
    }
}

function validatePlacaMoto(e) {
    const placa = document.getElementById('placa').value;
    if (placa.length < 3) {
        let soloLetraslet = soloLetras(e);
        if (soloLetraslet === false) {
            return false;
        }
    } else if (placa.length === 3) {
        putdash(e);
    } else if (placa.length > 3 && placa.length < 6) {
        console.log(placa.length);
        let soloNumlet = soloNum(e);
        console.log(soloNumlet);
        if (soloNumlet === false) {
            return false;
        }
    } else if (placa.length === 6) {
        console.log('hola');
        let soloLetraslet = soloLetras(e);
        if (soloLetraslet === false) {
            return false;
        }
    } else {
        const placa = document.getElementById('placa').value;
        let newValue = placa;
        document.getElementById('placa').value = newValue.toUpperCase();
        return false;
    }
}



function valitePlacaType(e) {

    let tipo = document.getElementById('Tipo').value;
    if (tipo === "Carro") {
        const validatePlacaCarrVar = validatePlacaCarr(e);
        if (validatePlacaCarrVar === false) {
            return false;
        }
    } else if (tipo === "Moto") {
        const validatePlacaMotoVar = validatePlacaMoto(e);
        if (validatePlacaMotoVar === false) {
            return false;
        }
    } else {
        return false;
    }
}


changeSpaces();
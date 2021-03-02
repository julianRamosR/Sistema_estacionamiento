const BaseURL = "http://localhost:5000/"
const { Id, Lastname, Name } = JSON.parse(sessionStorage.getItem('user')) || false;

//Consulta a la API
async function consulta() {
    const URL = `${BaseURL}login/user/`
    if (Id) {
        const data = {
            id: Id
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
            swal({
                text: "No tiene permiso para estar aquí",
                button: 'Volver'
            }).then(value => {
                window.location.href = '../Index.html'
            })
        }

    } else {
        swal({
            text: "No tiene permiso para estar aquí",
            button: 'Volver'
        }).then(value => {
            window.location.href = '../Index.html'
        })
    }
}

consulta();
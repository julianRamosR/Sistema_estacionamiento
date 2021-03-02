const BaseURL = "http://localhost:5000/"

async function Login() {
    const URL = `${BaseURL}login/validationlogin/`;
    const user = document.getElementById('user').value;
    const pass = document.getElementById('pass').value;
    const Data = {
        user: user,
        pass: pass
    }
    const consult = await fetch(URL, {
        method: 'POST', // or 'PUT'
        body: JSON.stringify(Data), // data can be `string` or {object}!
        headers: {
            'Content-Type': 'application/json'
        }
    })
    const results = await consult.json();

    access(results.value, results.userInfo)
    console.log(results);

}

function access(value, results) {
    if (!value) {
        swal({
            text: "Usuario o contraseña incorrectos",
            button: "OK",
        });
    } else {
        sessionStorage.setItem('user', JSON.stringify(results))
        window.location = "./Paginas/Inscribir.html"
    }

}
const button = document.getElementById('Login-Button');
// button.onclick = Login()
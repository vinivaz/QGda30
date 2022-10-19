
import '../../styles/login/style.css';

import api from '../../tools/api.js'
import { login, isAuthenticated } from '../../tools/auth';

//import "jquery"

function isLogged(){
    if(isAuthenticated()){
        window.location.assign("https://qgda30.herokuapp.com/app/storage");
    }
}

isLogged()

var emailInput = $('input[type=email]')
var passwordInput = $('input[type=password]')
var feedback = $('div.feedback')


emailInput.on('click', function(){
    feedback.empty()
})

passwordInput.on('click', function(){
    feedback.empty()
})

$('button#login').on('click', handleLogin)

function handleLogin(){
    isLogged()
    feedback.empty()
    var email = emailInput.val().trim()
    var password = passwordInput.val().trim()

    if(!email){
        feedback.append('<p>Insira e-mail válido</p>')
        return
    }

    if(!password){
        feedback.append('<p>Insira senha</p>')
        return
    }

    api.post('/app/authenticate',{email, password})
    .then(res => {
        if(res.data.error){
            feedback.append(`<p>${res.data.error}</p>`)
            return
        }
        console.log(res.data)
        const token = res.data.token;
        login(token);
        window.location.assign("https://qgda30.herokuapp.com/app/storage");
        
    })
    .catch(res =>{ console.log(res)})
}

import api from '../../tools/api.js'
import { login, isAuthenticated } from '../../tools/auth';



function handleCredentialResponse(response) {
    const data = jwt_decode(response.credential)
    console.log(data)

    // if(data.email){

    // }
  
    // fullName.textContent = data.name
    // sub.textContent = data.sub
    // given_name.textContent = data.given_name
    // family_name.textContent = data.family_name
    // email.textContent = data.email
    // verifiedEmail.textContent = data.email_verified
    // picture.setAttribute("src", data.picture)
  }
  
  window.onload = function () {

  
    google.accounts.id.initialize({
      client_id: "336974764663-aehkv8e1qou5np7b2fvog1o7pagapold.apps.googleusercontent.com",
      callback: handleCredentialResponse
    });
  
    google.accounts.id.renderButton(
      document.getElementById("google-login-btn"), {
      theme: "filled_black",
      size: "large",
      type: "standard",
      shape: "pill",
      locale: "pt-BR",
      logo_alignment: "left",
    } // customization attributes
    );
  
    google.accounts.id.prompt(); // also display the One Tap dialog
  }

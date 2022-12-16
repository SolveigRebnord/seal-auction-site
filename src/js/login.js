import "../style.css";
import { LOG_IN_URL } from "./ingredients/endpoints";
import {
  saveToken,
  saveUser,
} from "./ingredients/storage";

const logInForm = document.getElementById("login-form");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const emailMessage = document.getElementById("email-message");
const passwordMessage = document.getElementById("password-message");
const errorMessage = document.getElementById("error-message");

logInForm.addEventListener("submit", logIn);

function logIn(event) {
  event.preventDefault();

  let accessToken;
  let username;
  let emailValue = emailInput.value;
  let validEmail = false;
  let passwordValue = passwordInput.value;
  let validPassword = false;
  let validForm = false;

  if (emailValue) {
    validEmail = true;
    emailMessage.innerHTML = null;
  } else {
    validEmail = false;
    emailMessage.innerHTML = "Missing email";
    errorMessage.classList.add("invisible");
    errorMessage.innerHTML = "";
  }

  if (passwordValue) {
    validPassword = true;
    passwordMessage.innerHTML = null;
  } else {
    validPassword = false;
    passwordMessage.innerHTML = "Missing password";
    errorMessage.classList.add("invisible");
    errorMessage.innerHTML = "";
  }

  if (validEmail && validPassword) {
    validForm = true;
  }

  if (validForm) {
    let loginBody = {
      email: `${emailValue}`,
      password: `${passwordValue}`,
    };
    let jsonBody = JSON.stringify(loginBody);

    (async function requireLogIn() {
      try {
        const response = await fetch(LOG_IN_URL, {
          method: "POST",
          body: jsonBody,
          headers: {
            "Content-type": "application/json; charset=UTF-8",
          },
        });
        const data = await response.json();
        if (response.ok) {
          accessToken = data.accessToken;
          username = data.name;
          saveToken(accessToken);
          saveUser(username);
          window.setTimeout(function () {
            window.location.replace("/index.html");
          }, 1000);
        } else {
          errorMessage.classList.remove("invisible");
          errorMessage.innerHTML =
            "Seems like there's no match.. <br> Head to sign in or try again";
        }
      } catch (error) {
        console.log(error);
      }
    })();
  }
}

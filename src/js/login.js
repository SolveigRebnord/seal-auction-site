import "../style.css";
import { LOG_IN_URL, ALL_PROFILES_URL } from "./ingredients/endpoints";
import { saveToken, saveUser, saveToStorage, getUsername, getToken } from "./ingredients/storage";
import {toaster} from "./ingredients/components";

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
          toaster("success", "Successfully logged in", "Enjoy");
          async function getMyLis() {
            try {
              const response = await fetch(
                `${ALL_PROFILES_URL}/${getUsername()}?_listings=true`,
                {
                  method: "GET",
                  headers: {
                    Authorization: `Bearer ${getToken()}`,
                    "Content-type": "application/json; charset=UTF-8",
                  },
                }
              );
              const data = await response.json();
              if (response.ok) {
                console.log(data)
                getWins(data.listings)
              } else {
                console.log("error", data);
              }
            } catch (error) {
              console.log(error);
            }
          }
          
          getMyLis()
          
          const myWins = [];
          function getWins(array) {
            for (let win of array) {
              myWins.push(win);
            }
          
            saveToStorage("wins", myWins)
          
            console.log(myWins)
            return myWins;
          }

          // redirect to google after 5 seconds.
          window.setTimeout(function () {
            window.location.replace("/index.html");
          }, 5000);
        } else {
          console.log("error", data);
          errorMessage.classList.replace("invisible", "visible");
          errorMessage.innerHTML = 
          `<div class="flex flex-col justify-center items-center">
            <img src="/warning.png" class="w-6">
            <p>No combination found</p>
            <p>Try again or head to sign up</p>
          </div>`;
        }
      } catch (error) {
        console.log(error);
      }
    })();
  }
}

import '../style.css'

import { SIGN_UP_URL } from "./ingredients/endpoints";


const signUpForm = document.getElementById("sign-up-form");
const username = document.getElementById("username");
const email = document.getElementById("email");
const password = document.getElementById("password");
const confirmPassword = document.getElementById("confirm-password");
const signUpButton = document.getElementById("sign-up-button");
const usernameMessage = document.getElementById("username-message");
const emailMessage = document.getElementById("email-message");
const passwordMessage = document.getElementById("password-message");
const confirmPasswordMessage = document.getElementById(
  "confirm-password-message"
);
const errorMessage = document.getElementById("error-message");

signUpForm.addEventListener("submit", function (event) {
  signUp(event);
});

function validateEmail(email) {
    const regEx = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@(stud.noroff.no|noroff.no)$/;
    return email.match(regEx) ? true : false;
  }
  
  function validatePassword(password) {
    if (password.length >= 3) {
      return true;
    }
  }
  
  function confirmingPassword(password, confirmPassword) {
    if (!password) {
      return false;
    }
  
    if (!confirmPassword) {
      return false;
    }
  
    if (password === confirmPassword) {
      return true;
    }
  }
  
 
function signUp(e) {
  e.preventDefault();
  let validForm = false;
  let usernameContent = username.value;
  let validUsername = false;

  if (usernameContent) {
    validUsername = true;
    usernameMessage.innerHTML = "";
    username.classList.add("border-green-600");

    if (usernameContent === " ") {
      validUsername = false;
      usernameMessage.innerHTML = "We need more..";
      username.classList.replace("border-green-600", "border-white");
    }
  } else {
    usernameMessage.innerHTML = "We need something..";
    username.classList.replace("border-green-600", "border-white");
  }

  let emailContent = email.value;
  let validEmail = false;

  if (emailContent) {
    const validadedEmail = validateEmail(emailContent);
    if (validadedEmail) {
      validEmail = true;
      emailMessage.innerHTML = "";
      email.classList.add("border-green-600");
    } else {
      emailMessage.innerHTML = "Must be valid noroff email";
      email.classList.replace("border-green-600", "border-white");
    }
  } else {
    emailMessage.innerHTML = "We need something..";
    email.classList.replace("border-green-600", "border-white");
  }

  let passwordContent = password.value;
  let validPassword = false;

  if (passwordContent) {
    const validadedPassword = validatePassword(passwordContent);

    if (validadedPassword) {
      validPassword = true;
      passwordMessage.innerHTML = "";
      password.classList.add("border-green-600");
    } else {
      validPassword = false;
      passwordMessage.innerHTML = `Must be more than 3 characters`;
      password.classList.replace("border-green-600", "border-white");
    }
  } else {
    passwordMessage.innerHTML = "We need something..";
    password.classList.replace("border-green-600", "border-white");
  }

  let confirmPasswordContent = confirmPassword.value;
  let validConfirmPassword = false;

  if (confirmPasswordContent) {
    const matchingPasswords = confirmingPassword(
      passwordContent,
      confirmPasswordContent
    );

    if (matchingPasswords) {
      validConfirmPassword = true;
      console.log("yey password matching");
      confirmPasswordMessage.innerHTML = "";
      confirmPassword.classList.add("border-green-600");
    } else {
      validConfirmPassword = false;
      confirmPasswordMessage.innerHTML = "Not matching";
      confirmPassword.classList.replace("border-green-600", "border-white");
    }
  } else {
    validConfirmPassword = false;
    confirmPasswordMessage.innerHTML = "We need something";
    confirmPassword.classList.replace("border-green-600", "border-white");
  }

  if (validUsername && validEmail && validPassword && validConfirmPassword) {
    validForm = true;
  } else {
    validForm = false;
    console.log("Not valid form");
  }

  const signUpBody = {
    name: `${usernameContent}`,
    email: `${emailContent}`,
    password: `${passwordContent}`,
  };

  const inJSON = JSON.stringify(signUpBody);

  if (validForm === true) {
    register(inJSON);
  }
}

async function register(body) {
  try {
    const response = await fetch(SIGN_UP_URL, {
      method: "POST",
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
      body: body,
    });

    const data = await response.json();

    if (response.ok) {
      console.log("success");
      window.location.replace("/index.html");
    } else {
      console.log("error", data);
      errorMessage.innerHTML = data;
    }
  } catch (error) {
    console.log(error);
  }
}

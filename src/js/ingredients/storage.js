const accessToken = "token";
const username = "username";

function saveToken(token) {
  saveToStorage("token", token);
}

function saveUser(username) {
  saveToStorage("username", username);
}

function saveToStorage(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function getToken() {
  //console.log(getStoredData(accessToken));
  return getStoredData(accessToken);
}

function getUsername() {
  return getStoredData(username);
}

function getStoredData(key) {
  const value = localStorage.getItem(key);
  if (value) {
    return JSON.parse(value); // convert to JS
  } else {
    return null;
  }
}

export { saveToken, saveUser, getToken, getUsername };

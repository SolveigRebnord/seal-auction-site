import "../../style.css";

const listingsLI = document.getElementById("listings_li");
const newlistingLi = document.getElementById("newlisting_li");
const myprofileLI = document.getElementById("myprofile_li");
const theBody = document.getElementById("body");


const currentURL = window.location.toString();
console.log(currentURL);

if (currentURL.includes("index")) {
  listingsLI.classList.add(
    "bg-white",
    "text-blue",
    "py-10",
    "px-6",
    "shadow-xl"
  );
}

if (currentURL.includes("myprofile")) {
  myprofileLI.classList.add(
    "bg-white",
    "text-blue",
    "py-10",
    "px-6",
    "shadow-xl"
  );
}

if (currentURL.includes("newlisting")) {
  newlistingLi.classList.add(
    "bg-white",
    "text-blue",
    "py-10",
    "px-6",
    "shadow-xl"
  );
}

newlistingLi.addEventListener("click", function () {
  theBody.classList.add("opacity-0");
  setTimeout(function () {
    window.location = "newlisting.html";
  }, 200);
});

import "../../style.css";
import { clearStorage, getStoredData } from "./storage";
import { ALL_PROFILES_URL } from "./endpoints";
import { getUsername, getToken,  } from "./storage";

const mobileHeader = document.getElementById("header");
const mobileNav = document.getElementById("mobile_nav");
const bigScreenNav = document.getElementById("bigScreen_nav");

mobileHeader.innerHTML = ` <section id="mobile_header" class="flex flex-col p-6 md:p-8 gap-4">
<div class="flex flex-row items-center justify-between">
  <a href="index.html"
    ><img class="w-10 ml-2 mt-2" src="/seal_logo_black.svg" alt="Logo home"
  /></a>
  <a href="" id="notification_icon"
  ><img class="w-10 ml-2 mt-2" src="/coins.png" alt="Logo home"
  /></a>
  <a
    href="myprofile.html"
    id="header_profile"
    class="hover:cursor-pointer">
    <div
      class="flex flex-row items-center gap-4 font-robotoC tracking-wide">
      <p class="font-quickS text-xs lg:text-sm" id="profile_name"></p>
      <img class="w-6" src="/profile.png" alt="Profile icon" />
    </div>
  </a>
</div>
<div class="flex flex-row justify-end">
  <div class="flex flex-row gap-4 items-center relative">
    <input
      type="text"
      name="search_input"
      id="search_input"
      class="hidden border-b border-gray-400 h-6 w-80 px-4 outline-none bg-transparent text-sm pb-1 appearance-none"
      placeholder="What are you looking for?" />
    <img
      src="/icon_search.svg"
      id="search_btn"
      alt="Search icon"
      class="hover:cursor-pointer" />
    <ul
      id="showSearch"
      class="absolute h-96 overflow-scroll top-8 right-0 z-20 flex-col hidden gap-1 text-black"></ul>
  </div>
</div>
</section>
`;

mobileNav.innerHTML = `<ul
class="flex flex-row align-middle justify-between px-12 py-4 pb-6 fixed bottom-0 left-0 w-full border-t border-gray-200 bg-white">
<a href="index.html">
  <li class="p-2">
    <img class="w-6 h-6" src="/icon_home_blue.png" alt="Home icon" />
  </li>
</a>
<a href="newlisting.html">
  <li class="p-2">
    <img
      class="w-7 h-7"
      src="/icon_newlisting_blue.png"
      alt="New post icon" />
  </li>
</a>
<a href="myprofile.html">
  <li class="p-2">
    <img
      class="w-6 h-6"
      src="/icon_profile_blue.png"
      alt="Profile icon" />
  </li>
</a>
<li class="p-2 cursor-pointer" id="log_out">
  <img class="w-6 h-6" src="/log_out.png" alt="Log out icon" />
</li>
</ul>
`;

bigScreenNav.innerHTML = 
`<ul class="flex flex-col pt-20 justify-start text-center items-center gap-20 py-6 fixed top-0 left-0 h-full text-base tracking-wider text-white font-fjalla bg-blue uppercase md:w-40 lg:w-44">
<a href="index.html">
  <li class="pl-2 pb-10">
    <img class="w-18" src="/seal_logo_white.svg" alt="" />
  </li>
</a>
<a href="index.html" class="w-full text-center">
  <li id="listings_li" class="w-full">Listings</li>
</a>
<a href="newlisting.html" class="w-full text-center">
  <li id="newlisting_li" class="w-full">New listing</li>
</a>
<a href="myprofile.html" class="w-full text-center">
  <li id="myprofile_li" class="w-full">My profile</li>
</a>
<li class="pt-12 cursor-pointer" id="log_out">
  <img class="w-6" src="/logout_white.png" alt="Log out icon" />
</li>
</ul>
`;

const currentURL = window.location.toString();
const logOutBtn = document.getElementById("log_out");


logOutBtn.addEventListener("click", (e) => {
  let doubleCheck = confirm("Leaving already? :-(");
  if (doubleCheck == false) {
    return;
  } else {
    clearStorage();
    window.location.reload();
  }
});


if (currentURL.includes("index")) {
  const listingsLI = document.getElementById("listings_li");

  listingsLI.classList.add(
    "bg-white",
    "text-blue",
    "py-10",
    "px-6",
    "shadow-xl"
  );
}

if (currentURL.includes("id")) {
  const listingsLI = document.getElementById("listings_li");

  listingsLI.classList.add(
    "bg-white",
    "text-blue",
    "py-10",
    "px-6",
    "shadow-xl"
  );
}

if (currentURL.includes("myprofile")) {
  let myprofileLI = document.getElementById("myprofile_li");

  myprofileLI.classList.add(
    "bg-white",
    "text-blue",
    "py-10",
    "px-6",
    "shadow-xl"
  );
}

if (currentURL.includes("newlisting")) {
  const newlistingLi = document.getElementById("newlisting_li");

  newlistingLi.classList.add(
    "bg-white",
    "text-blue",
    "py-10",
    "px-6",
    "shadow-xl"
  );
}



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
      let newArray = [];
      for (let listing of data.listings) {
        newArray.push(listing.id)
      }
      let savedArray = getStoredData("wins"); //Will have wins, but is listings now, as this is something I could change quickly when testing

      let savedNewArray = [];
      for (let lis of savedArray) {
        savedNewArray.push(lis.id)
      }
      let missingItem = newArray.filter(u => !savedNewArray.includes(u));
      notify(missingItem)
      // Add this item to the saved array in locale storage, but then see comment on notify()

    } else {
      console.log("error", data);
    }
  } catch (error) {
    console.log(error);
  }
}

getMyLis()

function notify(id) {
    const notifyIcon = document.getElementById("notification_icon")
    notifyIcon.classList.add("after:content-['*']", "after:bg-red-500")
    // Would have a html element or link insted of this, but example of something visible
    //Need to figure out code that would make it stay until it is clicked once, so it doesnt disappear when the page is reloaded, and the array element has been saved
}

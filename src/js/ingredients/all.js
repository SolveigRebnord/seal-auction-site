import "../../style.css";
import { clearStorage } from "./storage";
import { getUsername } from "./storage";

const mobileHeader = document.getElementById("header");
const mobileNav = document.getElementById("mobile_nav");
const bigScreenNav = document.getElementById("bigScreen_nav");
const logOut = document.getElementById("logout_div");
const currentURL = window.location.toString();

mobileHeader.innerHTML = ` <section id="mobile_header" class="flex flex-col p-6 md:p-8 gap-4">
<div class="flex flex-row items-center justify-between">
  <a href="index.html" class="font-shadow text-4xl">
  seal
</a>
<div class="flex flex-row justify-end">
  <div class="mt-4 md:m-0 flex flex-row gap-4 relative">
    <input
      type="text"
      name="search_input"
      id="search_input"
      class=" border-b border-gray-400 h-6 w-72 px-4 outline-none bg-transparent text-sm font-quickS pb-1 appearance-none transition-all ease-in duration-200"
      placeholder="What are you looking for?" />
    <img
      src="/icon_search.svg"
      id="search_btn"
      alt="Search icon"
      class="hover:cursor-pointer" />
    <ul
      id="showSearch"
      class="absolute h-96 overflow-scroll top-8 right-0 z-20 hidden text-black p-4 rounded-md bg-white shadow-lg flex flex-col gap-6"></ul>
  </div>
</div>
    <a
      href="myprofile.html"
      id="header_profile"
      class="hover:cursor-pointer py-2 px-4">
      <div
        class="flex flex-row items-center justify-center gap-2 font-robotoC tracking-wide px-4 py-2 shadow-rightShadow rounded-md">
        <p class="font-robotoC text-gray-800 text-xs" id="profile_name"></p>
        <img class="w-8" src="/profile_icon.svg" alt="Profile icon" />
      </div>
    </a>
</div>

</section>
`;

const profileName = document.getElementById("profile_name");
const searchIcon = document.getElementById("search_btn");
profileName.innerHTML = getUsername();

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
<li class="p-2 cursor-pointer" id="logout_small">
  <img class="w-6 h-6" src="/log_out.png" alt="Log out icon" />
</li>
</ul>
`;
const logOutMobile = document.getElementById("logout_small");

bigScreenNav.innerHTML = `<ul class="flex flex-col pt-16 justify-start text-center items-center gap-20 py-6 fixed top-0 left-0 h-full text-base tracking-wider text-white font-fjalla bg-blue uppercase shadow-rightShadow md:w-40 lg:w-44">
<a id="logo" href="index.html">
  <li class=" pb-10">
    <p class="text-4xl tracking-widest">Seal</p>
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
</ul>
`;

logOut.innerHTML = `<div class="p-4 pr-7 rounded-md cursor-pointer bg-blue fixed bottom-4 -right-4 hover:shadow-lg hover:shadow-slate-500 transition-all duration-100 ease-in hover:scale-105" id="log_out">
<img class="w-6" src="/logout_white.png" alt="Log out icon" />
</div>`;

logOut.addEventListener("click", (e) => {
  let doubleCheck = confirm("Leaving already? :-(");
  if (doubleCheck === false) {
    return 0;
  } else {
    clearStorage();
    window.location.reload();
  }
});

logOutMobile.addEventListener("click", (e) => {
  let doubleCheck = confirm("Leaving already? :-(");
  if (doubleCheck === false) {
    return 0;
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
    "py-9",
    "w-[178px]",
    "shadow-smallShadow"
  );
}

if (currentURL.includes("id")) {
  const listingsLI = document.getElementById("listings_li");
  listingsLI.classList.add(
    "bg-white",
    "text-blue",
    "py-10",
    "w-[180px]",
    "shadow-smallShadow"
  );

  searchIcon.classList.add("hidden");
}

if (currentURL.includes("myprofile")) {
  let myprofileLI = document.getElementById("myprofile_li");
  myprofileLI.classList.add(
    "bg-white",
    "text-blue",
    "py-10",
    "w-[180px]",
    "shadow-smallShadow"
  );

  searchIcon.classList.add("hidden");
}

if (currentURL.includes("newlisting")) {
  const newlistingLi = document.getElementById("newlisting_li");
  newlistingLi.classList.add(
    "bg-white",
    "text-blue",
    "py-10",
    "w-[180px]",
    "shadow-smallShadow"
  );
  searchIcon.classList.add("hidden");
}

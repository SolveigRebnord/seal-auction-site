import "../../style.css";

const mobileHeader = document.getElementById("header");
const mobileNav = document.getElementById("mobile_nav");
const bigScreenNav = document.getElementById("bigScreen_nav");

mobileHeader.innerHTML = ` <section id="mobile_header" class="flex flex-col p-6 md:p-8 gap-4">
<div class="flex flex-row items-center justify-between">
  <a href="index.html"
    ><img class="w-16" src="/small_logo.svg" alt="Logo home"
  /></a>
  <a
    href="myprofile.html"
    id="header_profile"
    class="hover:cursor-pointer">
    <div
      class="flex flex-row items-center gap-2 font-robotoC text-sm tracking-wide">
      <p class="font-quickS text-xs" id="profile_name"></p>
      <img class="w-6" src="/profile.png" alt="Profile icon" />
    </div>
  </a>
</div>
<div class="flex flex-row justify-end">
  <div class="flex flex-row gap-4 items-center">
    <input
      type="text"
      name="search_input"
      id="search_input"
      class="hidden border-b border-gray-400 h-6 w-80 px-4 outline-none bg-transparent text-sm pb-1"
      placeholder="What are you looking for?" />
    <img
      src="/icon_search.svg"
      id="search_btn"
      alt="Search icon"
      class="hover:cursor-pointer" />
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
      class="w-6 h-6"
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
<li class="p-2">
  <img class="w-6 h-6" src="/log_out.png" alt="Log out icon" />
</li>
</ul>
`;

bigScreenNav.innerHTML = `  <ul
class="flex flex-col pt-20 justify-start text-center items-center gap-20 py-6 fixed top-0 left-0 h-full text-sm tracking-wider text-white font-fjalla bg-blue uppercase md:w-40 lg:w-44">
<a href="index.html">
  <li class="pl-2 pb-10">
    <img class="w-20" src="/seal.svg" alt="" />
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

const currentURL = window.location.toString();

if (currentURL.includes("index")) {
  const listingsLI = document.getElementById("listings_li");

  listingsLI.classList.add(
    "bg-white",
    "text-blue",
    "py-8",
    "px-6",
    "shadow-xl"
  );
}

if (currentURL.includes("id")) {
  const listingsLI = document.getElementById("listings_li");

  listingsLI.classList.add(
    "bg-white",
    "text-blue",
    "py-8",
    "px-6",
    "shadow-xl"
  );
}

if (currentURL.includes("myprofile")) {
  let myprofileLI = document.getElementById("myprofile_li");

  myprofileLI.classList.add(
    "bg-white",
    "text-blue",
    "py-8",
    "px-6",
    "shadow-xl"
  );
}

if (currentURL.includes("newlisting")) {
  const newlistingLi = document.getElementById("newlisting_li");

  newlistingLi.classList.add(
    "bg-white",
    "text-blue",
    "py-8",
    "px-6",
    "shadow-xl"
  );
}

import dayjs from "dayjs";

import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

import { ALL_PROFILES_URL, ALL_LIS_URL } from "./ingredients/endpoints";

import { getUsername, getToken } from "./ingredients/storage";

const profileInfo = document.getElementById("profile_info");
const profileName = document.getElementById("profile_name");
const activeFeed = document.getElementById("show_active");
const activeBidsBtn = document.getElementById("active_bids_button");
const activeLisBtn = document.getElementById("active_listings_button");
const editImgOverlay = document.getElementById("edit_img_overlay");

profileName.innerHTML = getUsername();

async function myProfile() {
  try {
    const response = await fetch(
      `${ALL_PROFILES_URL}/${getUsername()}?_listings=true&_bids=true`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      }
    );

    const data = await response.json();

    if (response.ok) {
      console.log(data);
      listProfile(data);
      if (data.listings.length !== 0) {
        myLis();
      }
    } else {
      console.log("error", data);
    }
  } catch (error) {
    console.log(error);
  }
}
myProfile();

activeLisBtn.addEventListener("click", myLis);

async function myLis() {
  activeLisBtn.disabled = true;
  activeLisBtn.classList.add("active-button");
  activeBidsBtn.disabled = false;
  activeBidsBtn.classList.remove("active-button");

  try {
    const response = await fetch(
      `${ALL_PROFILES_URL}/${getUsername()}/listings?_bids=true`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      }
    );

    const data = await response.json();

    if (response.ok) {
      console.log("myLis", data);
      activeSection(data);
    } else {
      console.log("error", data);
    }
  } catch (error) {
    console.log(error);
  }
}

myLis();

function listProfile(data) {
  let myProfile;
  let name;
  let email;
  let profileImg;
  let credits;
  let wins = [];
  let listings = [];

  if (data.name) {
    name = data.name;
  }

  if (data.email) {
    email = data.email;
  }

  if (data.credits) {
    credits = data.credits;
  }

  if (data.wins) {
    wins = data.wins;
    if (data.wins.length == 0) {
      wins = 0;
    }
  }

  if (data.avatar) {
    profileImg = data.avatar;
  }

  if (data.listings) {
    listings = `${data.listings.length} listings`;

    if (data.listings.length == 1) {
      listings = `${data.listings.length} listing`;
    }
    if (data.listings.length == 0) {
      listings = 0;
    }
  }

  myProfile = `
    <section class="h-fit rounded-md font-light font-quickS md:flex md:flex-row-reverse shadow-lg justify-between items-center md:p-6 lg:flex-col lg:shadow-none lg:p-0">
    <div class=" flex flex-col gap-2 justify-center items-center">
      <div class="w-60 h-60 rounded-xl shadow-xl bg-cover flex justify-end items-end p-4" style="background-image: url('${profileImg}')">
        <button id="edit_img_btn"><img class="w-6 outline outline-1 outline-white rounded-sm outline-offset-1" src="../img/edit_img.png"></button>
      </div>
        <h1 class="font-fjalla tracking-wide text-4xl">${name}</h1>
        <p class="text-sm">${email}</p>
    </div>
    <div class="flex flex-col items-center md:items-start lg:items-center">
        <p class="flex flex-row gap-3 py-6 text-lg items-center"><img class="w-6" src="../img/coins.png">${credits}</p>
        <p>${wins} wins</p>
        <p>${listings}</p>
    <div>
 
    </section>
    `;
  profileInfo.innerHTML = myProfile;

  let editImgBtn = document.getElementById("edit_img_btn");
  editImgBtn.addEventListener("click", editImg);
  editImgBtn.param = profileImg;
}

document.addEventListener(
  "click",
  function (event) {
    if (event.target.closest(".modal")) {
      if (event.target.closest(".main")) {
        return;
      } else {
        editImgOverlay.classList.toggle("hidden");
      }
    }
  },
  false
);

function editImg(e) {
  editImgOverlay.classList.toggle("hidden");

  let imgUrl = e.currentTarget.param;
  console.log(imgUrl);

  editImgOverlay.innerHTML = `<div  class="main">
    <p>Current profile image</p>
    <img class="w-20 h-20" src='${imgUrl}'>
    <p>Change URL:</p>
    <input id="edit_img_input" type="text" value="${imgUrl}">
    <button id="prew_edit_img">Preview</button>
    <p id="show_img"></p>
  </div>
`;

  let imgInput = document.getElementById("edit_img_input");
  let imgPrewBtn = document.getElementById("prew_edit_img");
  let imgPrew = document.getElementById("show_img");

  imgPrewBtn.addEventListener("click", showImg);

  function showImg() {
    let imgValue = imgInput.value;
    imgPrew.innerHTML = `<img class="w-20 h-20" src='${imgValue}'>
    <button id="approve_img_btn">Change image</button>`;

    let approveBtn = document.getElementById("approve_img_btn");
    approveBtn.addEventListener("click", requestImg);
    approveBtn.param = imgValue;
  }
}

async function requestImg(e) {
  let imgUrl = e.currentTarget.param;
  console.log(imgUrl);
  let body = {
    avatar: imgUrl,
  };

  try {
    const response = await fetch(`${ALL_PROFILES_URL}/${getUsername()}/media`, {
      method: "PUT",
      body: JSON.stringify(body),
      headers: {
        Authorization: `Bearer ${getToken()}`,
        "Content-type": "application/json; charset=UTF-8",
      },
    });

    const data = await response.json();

    if (response.ok) {
      console.log(data);
      window.location.reload();
    } else {
      console.log("error", data);
    }
  } catch (error) {
    console.log(error);
  }
}

function activeSection(data) {
  activeFeed.innerHTML = "";
  let activeListings = [];

  for (let lis of data) {
    console.log(lis);
    let ending = lis.endsAt;
    let diff = dayjs().diff(ending, "minute");

    if (diff < 0) {
      activeListings.push(lis);
    }
  }
  console.log(activeListings);
  if (activeListings.length == 0) {
    activeFeed.innerHTML = `<p class="w-full text-center text-sm font-quickS font-light py-4 italic text-gray-700">You have no active listings at the moment</p>`;
  } else {
    showListings(activeListings);
  }
}

function showListings(array) {
  let title;
  let endTime;
  let img;
  let created;
  let bids;
  let oneListing;
  let id;

  for (let lis of array) {
    title = lis.title;
    endTime = dayjs(lis.endsAt).format("DD/MM/YYYY  | HH:mm");
    img = lis.media;
    created = dayjs(lis.created).format("DD/MM/YYYY");

    bids = lis.bids;
    if (lis.bids == "") {
      bids = 0;
    }

    id = lis.id;

    oneListing = `
  <div class="w-full relative p-4 rounded-md bg-white shadow-lg flex flex-row justify-between text-right font-light font-robotoC">
    <div class="flex flex-col justify-between gap-8">
      <img class="rounded-full w-24 h-24" src="${img}">
      <div class="">
        <button id="${id}" class="deleteBtn"><img class="w-6" src="../img/trash.png"></button>
        <img id="change_listing" class="w-6" src="../img/edit.png">
      </div>
    </div>
    <div class="flex flex-col gap-2 text-sm">
      <h2 class="text-xl">${title}</h2>
      <p>Ends at ${endTime}</p>
      <p>Created ${created}</p>
      <p>${bids} bids</p>
    </div>
  </div>

  `;
    activeFeed.innerHTML += oneListing;

    const deleteButtons = document.getElementsByClassName("deleteBtn");

    for (let button of deleteButtons) {
      button.addEventListener("click", function (event) {
        event.preventDefault();
        deleteListing(button.id);
      });
    }
  }
}

async function deleteListing(id) {
  try {
    const response = await fetch(`${ALL_LIS_URL}/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    });
    myLis();

    const data = await response.json();

    if (response.ok) {
      console.log("success");
      console.log(data);
    } else {
      console.log("error", data);
    }
  } catch (error) {
    console.log(error);
  }
}

activeBidsBtn.addEventListener("click", allLis);

async function allLis() {
  activeLisBtn.disabled = false;
  activeLisBtn.classList.remove("active-button");
  activeBidsBtn.disabled = true;
  activeBidsBtn.classList.add("active-button");

  try {
    const response = await fetch(`${ALL_LIS_URL}?_bids=true`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    });

    const data = await response.json();

    if (response.ok) {
      console.log(data);
      let activeLisArr = [];
      for (let listing of data) {
        let ending = listing.endsAt;
        let diff = dayjs().diff(ending, "minute");
        if (diff < 0) {
          for (let bid of listing.bids) {
            let bidsLength = listing.bids.length;
            if (bid["bidderName"] == getUsername()) {
              console.log(listing.bids);
              let last = listing.bids.pop();
              console.log(last);
              if (last["bidderName"] == getUsername()) {
                activeLisArr.push(listing);
              }
            }
          }
        }
      }
      console.log(activeLisArr);
      if (activeLisArr.length == 0) {
        activeFeed.innerHTML = `<p class="w-full text-center text-sm font-quickS font-light py-4 italic text-gray-700">You have no active bids at the moment</p>`;
      } else {
        showActiveBids(activeLisArr);
      }
    } else {
      console.log("error", data);
    }
  } catch (error) {
    console.log(error);
  }
}

function showActiveBids(array) {
  activeFeed.innerHTML = "";

  let title;
  let endTime;
  let img;
  let created;
  let bids;
  let oneListing;
  let id;
  let lastItem;
  let allBids = [];
  let newarr;

  for (let lis of array) {
    title = lis.title;
    endTime = dayjs(lis.endsAt).format("DD/MM/YYYY  | HH:mm");
    img = lis.media;

    if (lis.bids !== "") {
      let oneBid;

      let lengde = lis.bids.length;

      let lastIndex = lengde - 1;
      lastItem = lis.bids.slice(lastIndex);

      for (let bid of lis.bids) {
        let bidderName = bid["bidderName"];
        if (bidderName == getUsername()) {
          bidderName = "Me";
        }

        oneBid = `<div class="flex flex-row justify-between items-center gap-2 bg-gray-100 text-gray-400 rounded-lg shadow-lg p-4 last-of-type:bg-white last-of-type:text-black last-of-type:outline-2 last-of-type:outline last-of-type:outline-blue">
                  <p>${bidderName}</p>
                  <p>${bid["amount"]}</p>
              </div>
              `;
        allBids.push(oneBid);

        newarr = allBids.join(" ");
      }
    }

    id = lis.id;

    oneListing = `
  <div class="w-full relative p-4 rounded-md bg-white shadow-lg flex flex-row justify-between text-right font-light font-robotoC">
    <div class="flex flex-col justify-between gap-8">
      <img class="rounded-full w-24 h-24" src="${img}">
    </div>
    <div class="flex flex-col gap-2 text-sm">
      <h2 class="text-xl">${title}</h2>
      <p>Ends at ${endTime}</p>
      <div class="flex flex-col gap-4">
      ${newarr}
  </div>
    </div>
  </div>

  `;
    activeFeed.innerHTML += oneListing;
  }
}

import dayjs from "dayjs";

import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

import { ALL_PROFILES_URL, ALL_LIS_URL } from "./ingredients/endpoints";

import { getUsername, getToken } from "./ingredients/storage";

const profileInfo = document.getElementById("profile_info");
const profileName = document.getElementById("profile_name");
const activeFeed = document.getElementById("show_active");

profileName.innerHTML = getUsername();

async function myProfile() {
  try {
    const response = await fetch(
      `${ALL_PROFILES_URL}/${getUsername()}?_listings=true`,
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

async function myLis() {
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
    <img class=" max-w-xxs object-cover max-h-60 rounded-xl shadow-xl " src="../img/profile_img.jpg">
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
}

function activeSection(data) {
  activeFeed.innerHTML = "";
  let activeListings = [];
  let activeBids;

  for (let lis of data) {
    console.log(lis);
    let ending = lis.endsAt;
    let diff = dayjs().diff(ending, "minute");

    if (diff < 0) {
      activeListings.push(lis);
    }
  }
  console.log(activeListings);
  showListings(activeListings);
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

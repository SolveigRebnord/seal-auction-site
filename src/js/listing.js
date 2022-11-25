import { ALL_LIS_URL } from "./ingredients/endpoints.js";
import dayjs from "dayjs";
import { getToken, getUsername } from "./ingredients/storage.js";

function checkAccess(key) {
  if (key === null) {
    console.log("bad token");
    window.location.replace("/login.html");
  }
}

checkAccess(getToken());

const logOutBtn = document.getElementById("log_out");
const searchBtn = document.getElementById("search_btn");
const searchInput = document.getElementById("search_input");
const profileName = document.getElementById("profile_name");
const listOutput = document.getElementById("list_listing");
const bidOverlay = document.getElementById("bid_overlay");

import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

logOutBtn.addEventListener("click", () => {
  let doubleCheck = confirm("Are you sure?");
  if (doubleCheck == false) {
    return;
  } else {
    clearStorage();
    window.location.reload();
  }
});

searchBtn.addEventListener("click", () => {
  searchInput.classList.toggle("hidden");
});

profileName.innerHTML = getUsername();

const queryString = window.location.search;
const postId = new URLSearchParams(queryString).get("id");
const ONE_LIS_URL = `${ALL_LIS_URL}/${postId}`;

(async function getLis() {
  try {
    const response = await fetch(`${ONE_LIS_URL}?_bids=true&_seller=true`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    });
    const data = await response.json();

    if (response.ok) {
      console.log("success");
      console.log(data);
      listListing(data);
    } else {
      console.log("error", data);
    }
  } catch (error) {
    console.log(error);
  }
})();

function listListing(lis) {
  let listing;
  let title;
  let desc;
  let tags = [];
  let media = [];
  let created;
  let endsAt;
  let id;
  let seller;
  let sellerImg;
  let bids = [];
  let amountOfBids;
  let bidder;
  let allBids = [];
  let newarr;
  let endTime;
  let lastItem;

  title = lis.title;

  desc = lis.description;

  sellerImg = lis.seller["avatar"];

  seller = lis.seller["name"];

  if (lis.endsAt) {
    let endingTime = new Date(lis.endsAt).getTime();
    let now = dayjs();
    let diff = endingTime - now;
    let days = Math.floor(diff / (1000 * 60 * 60 * 24));
    let hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    let minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    let seconds = Math.floor((diff % (1000 * 60)) / 1000);
    endsAt = `${days}d ${hours}h ${minutes}m ${seconds}s`; //enten få til at de går nedover, eller ta vekk sekunder

    let noe = dayjs().isAfter(dayjs(lis.endsAt));
    if (noe == true) {
      endsAt = "Ups, over";
    }
  }

  media = lis.media;
  created = dayjs(lis.created).format("DD/MM/YYYY");

  bids = lis.bids.length;
  if (lis.bids == "") {
    bids = 0;
  }

  if (lis.bids !== "") {
    let oneBid;

    let lengde = lis.bids.length;
    console.log(lengde);

    for (let bid of lis.bids) {
      oneBid = `<div class="flex flex-row justify-between items-center gap-2 bg-gray-100 text-gray-400 rounded-lg shadow-lg p-4 last-of-type:bg-white last-of-type:text-black last-of-type:outline-2 last-of-type:outline last-of-type:outline-blue">
                <p>${bid["bidderName"]}</p>
                <p>${bid["amount"]}</p>
            </div>
            `;
      allBids.push(oneBid);
      console.log(allBids);

      newarr = allBids.join(" ");
    }
  }

  id = lis.id;

  listing = `
    <div class=" w-full p-4 rounded-md flex flex-col font-light font-robotoC gap-6">
      <div class="flex flex-row gap-4 items-center">
        <img class="w-14 h-14 rounded-full" src="${sellerImg}">
        <div class="flex flex-col">
            <p class="text-normal font-fjalla">${seller}</p>
            <p class="text-gray-500">${created}</p>
        </div>
      </div>
      <div class="flex flex-col gap-2 text-sm">
      <p class="font-quickS text-2xl font-normal">${title}</p>
      <p>${desc}</p>
 
        <p>${bids} bids</p>
        <img class="w-full max-h-96 object-cover rounded-xl shadow-lg" src="${media}">
      </div>
      <div  class="flex flex-row items-baseline justify-between">
            <p>Ends in</p>
            <p id="time"></p>
        </div>
        <div class="flex flex-col gap-4">
            ${newarr}
        </div>
        <div class="flex justify-center">
            <button class="bg-blue rounded-md w-1/2 py-4 text-white" id="bid">Make a bid</button>
        </div>
    </div>
    `;
  listOutput.innerHTML = listing;

  document.getElementById("bid").addEventListener("click", makeBid);

  let timing = document.getElementById("time");
  function checkTime() {
    timing.innerHTML = `${endsAt}`;
  }

  setInterval(checkTime, 1000);
}

function makeBid() {
  bidOverlay.classList.toggle("hidden");
}

document.addEventListener(
  "click",
  function (event) {
    if (event.target.closest(".modal")) {
      if (event.target.closest(".main")) {
        return;
      } else {
        closeOverlay();
      }
    }
  },
  false
);

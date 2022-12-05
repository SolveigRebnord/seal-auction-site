import { ALL_LIS_URL, ALL_PROFILES_URL } from "./ingredients/endpoints.js";
import dayjs from "dayjs";
import { getToken, getUsername } from "./ingredients/storage.js";

const newListingLi = document.getElementById("newlisting_li");
const myProfileLi = document.getElementById("myprofile_li");
const headerProfileIcon = document.getElementById("header_profile");
const searchBtn = document.getElementById("search_btn");
const searchInput = document.getElementById("search_input");
const profileName = document.getElementById("profile_name");
const listOutput = document.getElementById("list_listing");
const bidOverlay = document.getElementById("bid_overlay");
const limitedAccessBanner = document.getElementById("limited_access_banner");

import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

function deactivateNav() {
  myProfileLi.href = "javascript:void(0)";
  myProfileLi.classList.add("disabled-link");
  newListingLi.href = "javascript:void(0)";
  newListingLi.classList.add("disabled-link");
}

function checkAccess(key) {
  if (key) {
    profileName.innerHTML = getUsername();
  } else {
    deactivateNav();
    profileName.innerHTML = "Log in for full access";
    headerProfileIcon.href = "login.html";
    limitedAccessBanner.classList.remove("hidden");
  }
}

checkAccess(getToken());

searchBtn.addEventListener("click", () => {
  searchInput.classList.toggle("hidden");
});

profileName.innerHTML = getUsername();

const queryString = window.location.search;
const postId = new URLSearchParams(queryString).get("id");
const ONE_LIS_URL = `${ALL_LIS_URL}/${postId}`;

async function getLis() {
  try {
    const response = await fetch(`${ONE_LIS_URL}?_bids=true&_seller=true`, {
      method: "GET",
    });
    const data = await response.json();

    if (response.ok) {
      listListing(data);

    } else {
      console.log("error", data);
    }
  } catch (error) {
    console.log(error);
  }
}
getLis();

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
  let newarr = "";
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

    let nowTime = dayjs().isAfter(dayjs(lis.endsAt));
    if (nowTime == true) {
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

    let lisLength = lis.bids.length;

    let lastIndex = lisLength - 1;
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

      if (allBids.length == 0) {
        newarr = "null";
      }
      else {
        newarr = allBids.join(" ");
      }
    }
  }

  id = lis.id;

  listing = `
    <div class=" w-full p-4 rounded-md flex flex-col font-light font-robotoC gap-6 lg:w-1/2">
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
      <div class="flex flex-row items-baseline justify-between">
        <p>Ends in</p>
        <p id="time"></p>
      </div>
      <div class="flex flex-col gap-4">
        ${newarr}
      </div>
      <div class="flex justify-center">
        <button class="bid bg-blue rounded-md w-1/2 py-4 text-white hover:cursor-pointer" id="bid">Make a bid</button>
      </div>
    </div>
    `;
  listOutput.innerHTML = listing;

  let theBid = document.getElementById("bid");

  theBid.param = lastItem;

  function checkAccess(key) {
    if (key) {
      theBid.addEventListener("click", makeBid);
    } else {
      theBid.innerHTML = "Sign in to get you hands on it!";
      theBid.classList.add("bg-white", "border-blue", "border-4", "text-black");
      theBid.classList.remove("bg-blue");
      theBid.addEventListener("click", (e) => {
        e.preventDefault();
        location.replace("login.html");
      });
    }
  }
  checkAccess(getToken());

  let timing = document.getElementById("time");
  function checkTime() {
    timing.innerHTML = `${endsAt}`;
  }
  setInterval(checkTime, 1000);
}

function makeBid(e) {
  bidOverlay.classList.toggle("hidden");
  let lastAmount
  let item = e.currentTarget.param;
  if (item.length == 0) {
    lastAmount = 1;
  }
  else {
    lastAmount= item[0]["amount"];
  }
  myCredits(lastAmount);
}

async function myCredits(lastAmount) {
  try {
    const response = await fetch(`${ALL_PROFILES_URL}/${getUsername()}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    });
    const data = await response.json();

    if (response.ok) {
      bidBox(data, lastAmount);
    } else {
      console.log("error", data);
    }
  } catch (error) {
    console.log(error);
  }
}

function bidBox(data, number) {

  let wallet = data.credits;

  bidOverlay.innerHTML = 
  `<div>
    <p>Your credits: ${wallet}</p>
    <p>Min. bid: ${number}</p>
    <input type="number" id="myBid">
    <button id="request-bid">Bid</button>
  </div>`;

  let bidReq = document.getElementById("request-bid");
  bidReq.addEventListener("click", checkBid);

  function checkBid() {
    let wantedBid = myBid.value;

    if (wantedBid > number) {

      let bidBody = {
        amount: Number(wantedBid),
      };

      requestBid(bidBody);
    } else {
      console.log("Fail to request");
    }
  }

  async function requestBid(body) {

    try {
      const response = await fetch(`${ALL_PROFILES_URL}/${getUsername()}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      });
      const data = await response.json();

      if (response.ok) {
        enoughCredits(data, body);
      } else {
        console.log("error", data);
      }
    } catch (error) {
      console.log(error);
    }
  }

  function enoughCredits(data, body) {
    if (data.credits > body.amount) {
      sendBid(body);
    }
  }
}

async function sendBid(body) {

  let JSONBody = JSON.stringify(body);

  try {
    const response = await fetch(`${ONE_LIS_URL}/bids`, {
      method: "POST",
      body: JSONBody,
      headers: {
        Authorization: `Bearer ${getToken()}`,
        "Content-type": "application/json; charset=UTF-8",
      },
    });
    const data = await response.json();

    if (response.ok) {
      bidOverlay.innerHTML = "";
      getLis();

    } else {
      console.log("error", data);
    }
  } catch (error) {
    console.log(error);
  }
}

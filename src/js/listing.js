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
      console.log(data)
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
  let tags = "";
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

  let oneImg;
  for (let img of lis.media) {
    oneImg = `<img class="rounded-lg w-fit max-w-sm object-cover" src=${img}>`;
    media += oneImg;
  }
  created = dayjs(lis.created).format("DD/MM/YYYY");

  bids = `<p><span class="text-2xl">${lis.bids.length} </span> bids</p>`;
  if (lis.bids == "") {
    bids = `<p><span class="text-2xl">0 </span> bids</p>`;
  }
  if (lis.bids.length == 1) {
    bids = `<p><span class="text-2xl">${lis.bids.length} </span> bid</p>`;
  }

  if (lis.tags) {
    let oneTag;
    for (let tag of lis.tags) {
      if (tag == "") {
        oneTag = "";
      }
      else {
        oneTag = `<p class="px-2 py-1 rounded-sm bg-blue w-fit h-fit text-white">${tag}</p>`;
      }
      tags += oneTag;
    }
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
                <p class="text-xl">${bid["amount"]} -,</p>
            </div>
            `;
      allBids.push(oneBid);

      if (allBids.length == 0) {
        newarr = "null";
      } else {
        newarr = allBids.join(" ");
      }
    }
  }

  id = lis.id;

  listing = `
    <div class="w-full p-4 rounded-md flex flex-col font-light font-robotoC gap-20 lg:w-2/3 lg:p-20  shadow-lg">
   
      <div class="flex flex-col gap-2 text-base lg:flex-row lg:gap-8">
        <div class="lg:w-1/2 flex flex-col gap-6">
          <div class="flex flex-row gap-4 items-center">
            <img class="w-14 h-14 lg:w-20 lg:h-20 object-cover rounded-full" src="${sellerImg}">
            <div class="flex flex-col gap-1">
              <p class="text-normal font-fjalla">${seller}</p>
              <p class="text-gray-500">${created}</p>
            </div>
          </div>
          <div class="flex flex-col gap-6">
            <p class="font-quickS text-2xl font-normal">${title}</p>
            <p class="max-w-xs whitespace-normal">${desc}</p>
            <div class="flex flex-row gap-4">${tags}</div>
          </div>
        </div>
        <div class="flex flex-row overflow-scroll gap-4 lg:h-80 lg:w-1/2 outline outline-1 outline-blue rounded-lg outline-offset-4">${media}</div>
        </div>
      <section class="lg:w-1/2 m-auto flex flex-col gap-6 p-12 shadow-md">
        <div class="flex flex-row items-baseline justify-between">
          <p>Ends in</p>
          <p class="text-xl" id="time"></p>
        </div>
        <hr>
        <div class="w-full text-center">
          ${bids}
        </div>
        <div class="flex flex-col gap-4">
          ${newarr}
        </div>
        <div class="flex justify-center">
          <button class="bid bg-blue shadow-md rounded-md w-1/2 mt-8 py-4 text-sm text-white hover:cursor-pointer" id="bid">Make a bid</button>
        </div>
        <div class="hidden bid_overlay"></div>
      </section>
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
  let lastAmount;
  let item = e.currentTarget.param;
  if (item.length == 0) {
    lastAmount = 1;
  } else {
    lastAmount = item[0]["amount"];
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

  let bidOverlay = document.querySelector(".bid_overlay")
  bidOverlay.classList.toggle("hidden");
  let wallet = data.credits;

  bidOverlay.innerHTML = `<div class="flex flex-col gap-8 pt-6">
    <div class="flex flex-row justify-between">
      <p>Minimum bid: <span class="text-xl">${number} -,</span></p>
      <p class="flex flex-row justify-between items-center gap-2 text-xl">${wallet}<img class="h-4" src="/coins.png"></p>
    </div> 
    <div class="w-fit m-auto flex flex-row gap-4 items-center">
      <input required class="h-12 w-24 shadow-md p-2 rounded-md" type="number" id="myBid">
      <button class="px-3 py-2 border h-fit text-darkerBlue border-darkerBlue rounded-md  font-cool" id="request-bid">Bid</button>
    </div>
  </div>`;

  let bidReq = document.getElementById("request-bid");
  let bidValueInput = document.getElementById("myBid")
  bidReq.addEventListener("click", checkBid);


  function checkBid() {
    let wantedBid = bidValueInput.value;

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
      document.querySelector(".bid_overlay").innerHTML = "";
      getLis();
    } else {
      console.log("error", data);
    }
  } catch (error) {
    console.log(error);
  }
}

import { ALL_LIS_URL, ALL_PROFILES_URL } from "./ingredients/endpoints.js";
import dayjs from "dayjs";
import { getToken, getUsername } from "./ingredients/storage.js";
import relativeTime from "dayjs/plugin/relativeTime";

const newListingLi = document.getElementById("newlisting_li");
const myProfileLi = document.getElementById("myprofile_li");
const headerProfileIcon = document.getElementById("header_profile");
const searchBtn = document.getElementById("search_btn");
const searchInput = document.getElementById("search_input");
const profileName = document.getElementById("profile_name");
const listOutput = document.getElementById("list_listing");
const limitedAccessBanner = document.getElementById("limited_access_banner");
const queryString = window.location.search;
const postId = new URLSearchParams(queryString).get("id");
const ONE_LIS_URL = `${ALL_LIS_URL}/${postId}`;

dayjs.extend(relativeTime);

function deactivateNav() {
  myProfileLi.href = "javascript:void(0)";
  myProfileLi.classList.add("disabled-link", "cursor-auto");
  newListingLi.href = "javascript:void(0)";
  newListingLi.classList.add("disabled-link", "cursor-auto");
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
  document.title = `${lis.title} | Seal`;

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
    endsAt = `${days}d ${hours}h ${minutes}m`;

    let nowTime = dayjs().isAfter(dayjs(lis.endsAt));
    if (nowTime == true) {
      endsAt = "Listing finished";
    }
  }

  let oneImg;
  for (let img of lis.media) {
    oneImg = `<li>
      <img class="rounded-lg object-cover min-w-[400px] h-80" src=${img}>
    </li>`;
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
      } else {
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
      </div>`;

      allBids.push(oneBid);

      if (allBids.length == 0) {
        newarr = "null";
      } else {
        newarr = allBids.join(" ");
      }
    }
  }

  id = lis.id;

  listing = `<div class="w-full p-4 rounded-md flex flex-col font-light font-robotoC md:mx-8 md:p-8 md:ml-48 gap-20 justify-center items-center  lg:p-16 shadow-lg">
    <div class="w-full flex flex-col gap-2 text-base lg:flex-row lg:gap-20">
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
          <div class="flex flex-row gap-4">${tags}
          </div>
        </div>
      </div>
      <ul class="flex flex-row overflow-x-scroll m-auto w-1/2 gap-2 lg:h-80 outline outline-1 outline-blue rounded-md outline-offset-8">${media}</ul>
    </div>
    <section class="lg:w-1/2 w-full  m-auto flex flex-col gap-6 p-6 shadow-md bg-white">
      <div class="flex flex-col items-center justify-between gap-4">
        <p>Ends in</p>
        <p class="text-xl">${endsAt}</p>
      </div>
      <hr>
      <div class="w-full text-center">
        ${bids}
      </div>
      <div class="flex flex-col gap-4 md:w-1/2 m-auto">
        ${newarr}
      </div>
      <div class="flex justify-center">
        <button class="bid bg-blue shadow-md rounded-md w-1/2 mt-8 py-4 text-sm text-white hover:cursor-pointer" id="bid">Make a bid</button>
      </div>
      <div class="hidden bid_overlay">
      </div>
    </section>
  </div>`;

  listOutput.innerHTML = listing;

  let theBid = document.getElementById("bid");

  theBid.param = lastItem;

  function checkLogin(key) {
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
  checkLogin(getToken());
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
  let bidOverlay = document.querySelector(".bid_overlay");
  bidOverlay.classList.toggle("hidden");
  let wallet = data.credits;

  bidOverlay.innerHTML = `<div class="flex flex-col gap-8 pt-6">
    <div class="flex flex-row justify-between">
      <p>Minimum bid: <span class="text-xl">${number} -,</span></p>
      <p class="flex flex-row justify-between items-center gap-2 text-xl">${wallet}<img class="h-4" src="/coins.png"></p>
    </div> 
    <div class="w-fit m-auto flex flex-row gap-4 items-center relative">
      <input required class="h-12 w-24 shadow-md p-2 rounded-md" type="number" id="myBid">
      <button class="px-3 py-2 border h-fit text-darkerBlue border-darkerBlue rounded-md uppercase tracking-wide font-fjalla" id="request-bid">Bid</button>
      <span class="hidden absolute -bottom-20 left-4 lg:-bottom-16 text-red-800" id="error-bid">Double check your bid</span>
    </div>
  </div>`;

  let bidReq = document.getElementById("request-bid");
  let bidValueInput = document.getElementById("myBid");
  let bidError = document.getElementById("error-bid");

  bidReq.addEventListener("click", checkBid);

  function checkBid() {
    let wantedBid = bidValueInput.value;

    if (wantedBid > number) {
      bidError.classList.add("hidden");
      let bidBody = {
        amount: Number(wantedBid),
      };
      requestBid(bidBody);
    } else {
      bidError.classList.remove("hidden");
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

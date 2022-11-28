console.log("hei");

import { ALL_LIS_URL } from "./ingredients/endpoints";
import dayjs from "dayjs";
import { getUsername, clearStorage, getToken } from "./ingredients/storage";

import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

const feed = document.getElementById("feed");
const profileName = document.getElementById("profile_name");
const filterBtn = document.getElementById("select_filter");
const logOutBtn = document.getElementById("log_out");
const searchBtn = document.getElementById("search_btn");
const searchInput = document.getElementById("search_input");

function checkAccess(key) {
  if (key === null) {
    console.log("bad token");
    window.location.replace("/login.html");
  }
}

checkAccess(getToken());

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

async function allLis() {
  try {
    const response = await fetch(
      `${ALL_LIS_URL}?_seller=true&_bids=true&sort=created`,
      {
        method: "GET",
      }
    );

    const data = await response.json();

    if (response.ok) {
      console.log("success");
      console.log(data);
      listLis(data);
    } else {
      console.log("error", data);
    }
  } catch (error) {
    console.log(error);
  }
}
allLis();

let value = filterBtn.value;
console.log(value);
filterBtn.addEventListener("change", function () {
  console.log(filterBtn.value);
  let value = filterBtn.value;
  if (value == "newest") {
    allLis();
  }
  if (value == "oldest") {
    allLisOld();
  }

  if (value == "a-aa") {
    allLisA();
  }

  if (value == "aa-a") {
    allLisAA();
  }

  if (value == "active-listings") {
    allLisActive();
  }

  if (value == "bidded-listings") {
    allLisBidded();
  }
});

async function allLisOld() {
  try {
    const response = await fetch(
      `${ALL_LIS_URL}?_seller=true&_bids=true&sort=created&sortOrder=asc`,
      {
        method: "GET",
      }
    );

    const data = await response.json();

    if (response.ok) {
      console.log(data);
      listLis(data);
    } else {
      console.log("error", data);
    }
  } catch (error) {
    console.log(error);
  }
}

async function allLisA() {
  try {
    const response = await fetch(
      `${ALL_LIS_URL}?_seller=true&_bids=true&sort=title&sortOrder=asc`,
      {
        method: "GET",
      }
    );

    const data = await response.json();

    if (response.ok) {
      console.log(data);
      listLis(data);
    } else {
      console.log("error", data);
    }
  } catch (error) {
    console.log(error);
  }
}

async function allLisAA() {
  try {
    const response = await fetch(
      `${ALL_LIS_URL}?_seller=true&_bids=true&sort=title&sortOrder=desc`,
      {
        method: "GET",
      }
    );

    const data = await response.json();

    if (response.ok) {
      console.log(data);
      listLis(data);
    } else {
      console.log("error", data);
    }
  } catch (error) {
    console.log(error);
  }
}

async function allLisActive() {
  try {
    const response = await fetch(
      `${ALL_LIS_URL}?_seller=true&_bids=true&sort=created`,
      {
        method: "GET",
      }
    );

    const data = await response.json();

    if (response.ok) {
      console.log("success");
      console.log(data);

      let activeListings = [];

      for (let lis of data) {
        if (lis.endsAt) {
          let noe = dayjs().isAfter(dayjs(lis.endsAt));
          if (noe == false) {
            activeListings.push(lis);
          }
        }
      }
      console.log(activeListings);
      listLis(activeListings);
    } else {
      console.log("error", data);
    }
  } catch (error) {
    console.log(error);
  }
}

async function allLisBidded() {
  try {
    const response = await fetch(
      `${ALL_LIS_URL}?_seller=true&_bids=true&sort=created`,
      {
        method: "GET",
      }
    );

    const data = await response.json();

    if (response.ok) {
      console.log("success");
      console.log(data);

      let activeListings = [];
      let amountOfBids;
      let diffTime;

      for (let bid of data) {
        amountOfBids = bid.bids.length;
        diffTime = dayjs().isAfter(dayjs(bid.endsAt));

        if (amountOfBids !== 0 && diffTime == false) {
          activeListings.push(bid);
        }
      }
      console.log(activeListings);
      listLis(activeListings);
    } else {
      console.log("error", data);
    }
  } catch (error) {
    console.log(error);
  }
}

function listLis(data) {
  //console.log(data);

  feed.innerHTML = "";

  for (let lis of data) {
    let oneLi;
    let title;
    let desc;
    let tags = [];
    let media = [];
    let created;
    let updated;
    let endsAt;
    let id;
    let seller;
    let sellerImg;
    let bids = [];
    let amountOfBids;
    let bidder;

    if (lis.title) {
      title = lis.title;
    }

    if (lis.description) {
      desc = lis.description;
    }
    if (lis.tags) {
      for (let tag of lis.tags) {
        tags += `<li>${tag}</li>`;
      }
    }

    if (lis.seller["name"]) {
      seller = lis.seller["name"];
    }

    if (lis.seller["avatar"]) {
      sellerImg = `<img class="rounded-full w-20 h-20 object-cover" src="${lis.seller["avatar"]}">`;
    }

    if (lis.media) {

      media = lis.media;

      if (media.length == 0) {
        console.log("teit")
        media = '../img/no_img.svg';
      }
 
    }

    if (lis.created) {
      let time = dayjs().to(dayjs(lis.created));
      created = time;
    }

    if (lis.updated) {
      let timeUpdated = dayjs().to(dayjs(lis.updated));
      /*if (timeUpdated !== created) {
          updated = `<img class="h-4" src="../../img/clock.png">Last updated ${timeUpdated}`;
        } else {
          updated = "";
        }*/
      updated = `<img class="h-4" src="../../img/clock.svg">Last updated ${timeUpdated}`;
    }

    if (lis.id) {
      id = lis.id;
    }

    if (lis.bids) {
      amountOfBids = lis.bids.length;

      for (let bid of lis.bids) {
        bidder = bid["bidderName"];
        bids =
          //`<p class="bg-white p-1 px-2 rounded-full border border-black">${bidder}</p>
          `<p class="flex text-3xl font-extralight font-robotoC gap-2 flex-row items-center">${bid["amount"]} -,</p>`;
      }
      if (amountOfBids == 0) {
        bids = `<p class="flex text-lg pt-2 font-robotoC text-black gap-2 flex-row items-center">Be nr. 1</p>`;
        bidder = "";
      }
    }

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

    oneLi = `<div class=" h-fit w-fit lg:w-fit lg:bg-inherit font-quickS font-light text-xs">
            <div class="w-64 h-80 rounded-lg bg-cover bg-center" style="background-image: url('${media}')">
              <a href="listing.html?id=${id}" class="w-full h-full flex items-end">
              <div class="w-full bg-white flex flex-col shadow-lg rounded-b-lg p-4">
                <h2 class="text-base font-extralight font-sans tracking-wide truncat whitespace-nowrap">${title}</h2>
                <div class="flex flex-row justify-between items-baseline pt-2">
                <p class="text-xs text-blue"> ${endsAt}</p>
                    ${bids}
                  
                </div>
              </div>
              </a>
            </div>  
            </a>
           </div>
                `;

    feed.innerHTML += oneLi;
  }
}

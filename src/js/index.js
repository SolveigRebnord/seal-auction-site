import { ALL_LIS_URL } from "./ingredients/endpoints";
import dayjs from "dayjs";
import { getUsername, getToken } from "./ingredients/storage";
import relativeTime from "dayjs/plugin/relativeTime";
import { searching, sendposts } from "./ingredients/components";

const feed = document.getElementById("feed");
const profileName = document.getElementById("profile_name");
const filterBtn = document.getElementById("select_filter");
const newListingLi = document.getElementById("newlisting_li");
const myProfileLi = document.getElementById("myprofile_li");
const headerProfileIcon = document.getElementById("header_profile");
const limitedAccessBanner = document.getElementById("limited_access_banner");
const searchBtn = document.getElementById("search_btn");
const searchInput = document.getElementById("search_input");
const showSearch = document.getElementById("showSearch");

searchInput.addEventListener("keyup", searching);
searching();

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

searchBtn.addEventListener("click", () => {
  searchInput.classList.toggle("hidden");
});

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
      sendposts(data);
      listLis(data);
    } else {
      console.log("error", data);
    }
  } catch (error) {
    console.log(error);
  }
}
allLis();

filterBtn.addEventListener("change", () => {
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
      let activeListings = [];

      for (let lis of data) {
        if (lis.endsAt) {
          let nowTime = dayjs().isAfter(dayjs(lis.endsAt));
          if (nowTime == false) {
            activeListings.push(lis);
          }
        }
      }
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
      listLis(activeListings);
    } else {
      console.log("error", data);
    }
  } catch (error) {
    console.log(error);
  }
}

function listLis(data) {
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
      let oneImg;

      for (let img of lis.media) {
        oneImg = img;
        media = oneImg;
      }

      if (media.length == 0) {
        media = "/no_img.svg";
      }
    }

    if (lis.created) {
      let time = dayjs().to(dayjs(lis.created));
      created = `<img class="h-4" src="/clock.svg">${time}`;
    }

    if (lis.updated) {
      let timeUpdated = dayjs().to(dayjs(lis.updated));
      /*if (timeUpdated !== created) {
          updated = `<img class="h-4" src="../../img/clock.png">Last updated ${timeUpdated}`;
        } else {
          updated = "";
        }*/
      updated = `<img class="h-4" src="/clock.svg">Last updated ${timeUpdated}`;
    }

    if (lis.id) {
      id = lis.id;
    }

    if (lis.bids) {
      amountOfBids = lis.bids.length;

      for (let bid of lis.bids) {
        bidder = bid["bidderName"];
        bids = `<p class="text-sm rounded-b-md h-10 flex justify-center items-center bids border-t border-blue">${bid["amount"]} -,</p>`;
      }
      if (amountOfBids == 0) {
        bids = `<p class="bids border-t border-blue rounded-b-md h-10 flex justify-center items-center text-sm">Be nr. 1</p>`;
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
      endsAt = `${days}d ${hours}h ${minutes}m`; //enten få til at de går nedover, eller ta vekk sekunder

      let nowTime = dayjs().isAfter(dayjs(lis.endsAt));
      if (nowTime == true) {
        endsAt = "Listing finished";
      }
    }

    oneLi = `<a href="listing.html?id=${id}" class="w-full font-quickS font-light text-xs max-w-xs md:max-w-xxs hover:drop-shadow-lg">
      <div class="h-listingH w-full relative rounded-lg bg-cover bg-center flex flex-col justify-end" style="background-image: url('${media}')">
        <div class="w-full h-72 max-h-72 md:h-32 flex items-end">
          <div class="w-full bg-white flex flex-col shadow-lg rounded-b-lg gap-2 pt-4">
            <h2 class="text-base max-h-6 px-2 font-extralight font-sans tracking-wide overflow-hidden">${title}
            </h2>
            <div class="flex flex-row justify-between items-center px-2">
              <p class="text-xs text-blue flex flex-row gap-1">
                <img class="h-4" src="/clock.png">${endsAt}
              </p>
            </div>
            <span class="">${bids}</span>
          </div>
        </div>
      </div>  
    </a>`;
    feed.innerHTML += oneLi;
  }

  let spans = document.querySelectorAll(".bids");
  for (let span of spans) {
    let og = span.innerHTML;
    span.addEventListener("mouseenter", (e) => {
      e.preventDefault();
      span.classList.add(
        "bg-blue",
        "text-white",
        "uppercase",
        "font-light",
        "font-cuprum",
        "tracking-widest"
      );
      span.innerHTML = "Make a bid";
      span.addEventListener("mouseleave", (e) => {
        e.preventDefault();
        span.classList.remove(
          "bg-blue",
          "text-white",
          "uppercase",
          "font-light",
          "font-cuprum",
          "tracking-widest"
        );

        span.innerHTML = og;
      });
    });
  }
}

import dayjs from "dayjs";
import Tagify from "@yaireo/tagify";
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
const myListings = document.getElementById("my_listings_div");
const editListingOverlay = document.getElementById("edit_listing_overlay");
const previewImg = document.getElementById("prew_img");

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
      allMyListings(data);
    } else {
      activeSection(data);
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
    <section class="h-fit w-2/3 rounded-md font-light font-quickS md:flex md:flex-row-reverse shadow-lg justify-between items-center md:p-6 lg:py-12 lg:flex-col">
    <div class=" w-fit flex flex-col gap-2 justify-center items-center">
      <div class="w-72 h-72 rounded-xl shadow-xl bg-cover flex justify-end items-end p-4" style="background-image: url('${profileImg}')">
        <button id="edit_img_btn"><img class="w-6 outline outline-1 outline-white rounded-sm outline-offset-1" src="/edit_img.png"></button>
      </div>
        <h1 class="font-fjalla tracking-wide text-4xl">${name}</h1>
        <p class="text-sm">${email}</p>
    </div>
    <div class="flex flex-col items-center md:items-start lg:items-center">
        <p class="flex flex-row gap-3 py-6 text-lg items-center"><img class="w-6" src="/coins.png">${credits}</p>
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
  let media = "";
  let created;
  let bids;
  let desc;
  let oneListing;
  let id;
  let amountOfBids;
  let bidder;
  let tags = "";
  let bidNumber;

  for (let lis of array) {
    title = lis.title;

    endTime = `Ends at ` + dayjs(lis.endsAt).format("DD/MM/YYYY  | HH:mm");

    created = dayjs(lis.created).format("DD/MM/YYYY");

    if (lis.description) {
      desc = lis.description;
    }

    if (lis.bids) {
      amountOfBids = lis.bids.length;

      bidNumber = `${amountOfBids} bids`;

      if (amountOfBids == 1) {
        `${amountOfBids} bid`;
      }

      for (let bid of lis.bids) {
        bidder = bid["bidderName"];
        bids = `
        <p class="">${bidder}</p>
          <p class=""><span class="text-xs">Current bid </span>${bid["amount"]} -,</p>`;
      }

      if (amountOfBids == 0) {
        bids = `<p class="flex text-base font-dosisgap-1 font-semibold flex-row items-center">No bids</p>`;
        bidder = "";
      }
    }

    id = lis.id;

    let oneImg;
    for (let img of lis.media) {
      oneImg = `<img class="rounded-lg w-fit max-w-sm object-cover" src=${img}>`;
      media += oneImg;
    }

    if (lis.tags) {
      let oneTag;
      for (let tag of lis.tags) {
        oneTag = `<p class="px-2 py-1 rounded-sm bg-blue w-fit h-fit text-white">${tag}</p>`;
        tags += oneTag;
      }
    }

    oneListing = `
  <div class="w-full p-4 rounded-md bg-white shadow-lg text-base font-light flex flex-col gap-4">
    <div class="flex flex-col justify-between gap-4">
      <h2 class="text-xl">${title}</h2>
      <p class="">${desc}</p>
      <div class="flex flex-row gap-2">${tags}</div>
      <div class="flex flex-row overflow-scroll gap-4">${media}</div>
    </div>
    <hr>
    <div class="flex flex-col gap-4">
    
      <p>${endTime}</p>
      <p>Created ${created}</p>
      <p>${bidNumber}</p>
      <div class="flex flex-row justify-between items-baseline border border-blue rounded-md p-2">
        ${bids}
      </div>
    </div>
  </div>

  `;
    activeFeed.innerHTML += oneListing;
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
          console.log(listing.bids);
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

function allMyListings(array) {
  myListings.innerHTML = "";
  let title;
  let endTime;
  let media = "";
  let created;
  let bids;
  let desc;
  let oneListing;
  let id;
  let amountOfBids;
  let bidder;
  let tags = "";
  let bidNumber;

  for (let lis of array) {
    let nowTime = dayjs().isAfter(dayjs(lis.endsAt));

    title = lis.title;
    endTime = `Ends at ` + dayjs(lis.endsAt).format("DD/MM/YYYY  | HH:mm");

    if (nowTime == true) {
      endTime = `Ended at ` + dayjs(lis.endsAt).format("DD/MM/YYYY  | HH:mm");
    }

    created = dayjs(lis.created).format("DD/MM/YYYY");

    if (lis.description) {
      desc = lis.description;
    }

    if (lis.bids) {
      amountOfBids = lis.bids.length;

      bidNumber = `${amountOfBids} bids in total`;

      if (amountOfBids == 1) {
        `${amountOfBids} bid in total`;
      }

      for (let bid of lis.bids) {
        bidder = bid["bidderName"];
        bids = `
        <p class="">${bidder}</p>
          <p class=""><span class="text-xs">Current bid </span>${bid["amount"]} -,</p>`;

        if (nowTime == true) {
          bids = `<p class="">${bidder}</p>
              <p class="text-xl font-robotoC"><span class="text-xs">Winning bid </span> ${bid["amount"]} -,</p>`;
        }
      }
      if (amountOfBids == 0) {
        bids = `<p class="flex flex-row items-center text-gray-400 italic">We'll show the latest bid, stay strong!</p>`;
        bidder = "";
      }
    }

    id = lis.id;

    let oneImg;
    for (let img of lis.media) {
      oneImg = `<img class="rounded-lg w-fit " src=${img}>`;
      media += oneImg;
    }

    if (lis.tags) {
      let oneTag;
      for (let tag of lis.tags) {
        oneTag = `<p class="px-2 py-1 rounded-sm bg-blue w-fit h-fit text-white">${tag}</p>`;
        tags += oneTag;
      }
    }

    oneListing = `
  <div class="w-full p-4 rounded-md bg-white shadow-lg text-sm font-light flex flex-col gap-4">
    <div class="flex flex-col justify-between gap-4">
      <h2 class="text-xl">${title}</h2>
      <p class="">${desc}</p>
      <div class="flex flex-row gap-2">${tags}</div>
      <div class="flex flex-row flex-wrap gap-4">${media}</div>
    </div>
    <hr>
    <div class="flex flex-col gap-4">
    
      <p>${endTime}</p>
      <p>Created ${created}</p>
      <p>${bidNumber}</p>
      <div class="flex flex-row justify-between items-baseline border-b border-b-blue p-2">
        ${bids}
      </div>
    </div>
   
    <div class="flex wrap flex-row justify-center gap-8 mt-6">
    <button id="${id}" class="deleteBtn outline outline-1 outline-black outline-offset-4 p-1 rounded-sm"><img class="w-6" src="/trash.png"></button>
    <button id="${id}" class="editBtn outline outline-1 outline-black outline-offset-4 p-1 rounded-sm"><img class="w-6" src="/edit.png"></button>
  </div>
  </div>

  `;
    myListings.innerHTML += oneListing;

    const deleteButtons = document.getElementsByClassName("deleteBtn");
    const editButtons = document.getElementsByClassName("editBtn");

    for (let button of deleteButtons) {
      button.addEventListener("click", function (event) {
        event.preventDefault();
        let doubleCheck = confirm(
          "Are you sure you want to delete this listing?"
        );
        if (doubleCheck == false) {
          return;
        } else {
          deleteListing(button.id);
        }
      });
    }

    for (let button of editButtons) {
      button.addEventListener("click", function (event) {
        event.preventDefault();
        button.classList.add("outline-2");
        editListing(button.id, title, desc, lis.tags, lis.media);
      });
    }
  }
}

function editListing(id, title, desc, tags, media) {
  editListingOverlay.classList.toggle("hidden");

  let onePrew = "";
  console.log(id, title, desc, tags, media);

  function testImg() {
    previewImg.innerHTML = "";
    for (let img of media) {
      onePrew = `<li class="li list-none cursor-pointer relative hover:after:content-['X'] hover:after:font-quickS after:text-sm after:flex after:justify-center after:items-center after:p-2 after:absolute after:-top-2 after:-right-2 after:w-6 after:h-6 hover:after:bg-blue  after:text-white after:rounded-full"><img class="w-20 h-20" src=${img}></li>`;
      previewImg.innerHTML += onePrew;
    }

    let allLis = document.querySelectorAll(".li");

    for (var i = 0; i < allLis.length; i++) {
      var img = allLis[i];
      img.addEventListener("click", removeImg);
      img.param = i;
    }
  }

  testImg();

  editListingOverlay.innerHTML = `<form
  class="p-6 md:shadow-none flex flex-col w-full gap-8 md:gap-8 font-quickS font-light lg:flex-row lg:justify-between lg:gap-32 lg:items-stretch"
>
  <div
    class="flex flex-col w-full gap-4 lg:w-1/2 lg:justify-between lg:gap-8"
  >
    <div>
      <input
        type="text"
        name="title"
        id="title"
        placeholder="title"
        required
        value="${title}"
        class="italic font-quickS pl-4 tracking-wide font-light placeholder:text-black text-2xl focus:outline-none bg-transparent"
      />
      <hr class="bg-black mb-4 mt-2 lg:mb-12" />
      <textarea
        name="desc"
        id="desc"
        placeholder="description.."
        class="auto-rows-max auto-cols-auto w-full h-fit border-none font-josefine font-light placeholder:text-gray-400 placeholder:italic focus:outline-none bg-transparent"
      >${desc}</textarea>
    </div>
    
    <div class="flex flex-col gap-8">
      
      <input
      name="tags"
      autofocus
      placeholder="Add tags"
      value="${tags}"
    />
      <input
        id="media_input"
        placeholder="Add image url"
        class="w-full p-2 border border-blue"
      />
      <button class="addImg">Add image</button>
    </div>
  </div>
  <button class="submitChangeBtn">Submit changes</button>
</form>
  `;

  var input = document.querySelector("input[name=tags]");
  new Tagify(input, {
    originalInputValueFormat: (valuesArr) =>
      valuesArr.map((item) => item.value).join(","),
  });

  input.addEventListener("change", onChange);

  function onChange(e) {
    let stringList = e.target.value;
    tags = stringList.split(",");
  }

  let addImgBtns = document.getElementsByClassName("addImg");
  for (let btn of addImgBtns) {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      let imgURL = media_input.value;
      media.push(imgURL);
      media_input.value = "";
      testImg();
    });
  }

  function removeImg(e) {
    let index = e.currentTarget.param;
    console.log(index);
    media.splice(index, 1);
    testImg();
  }

  let titleValue;
  let titleInput = document.getElementById("title");
  titleInput.addEventListener("change", (e) => {
    e.preventDefault();
    titleValue = titleInput.value;
  });

  let descValue;
  let descInput = document.getElementById("desc");
  descInput.addEventListener("change", (e) => {
    e.preventDefault();
    descValue = descInput.value;
  });

  let submitChangeBtns = document.getElementsByClassName("submitChangeBtn");
  for (let btn of submitChangeBtns) {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      editBody(id, titleValue, descValue, tags, media);
    });
  }
}

function editBody(id, title, desc, tags, media) {
  //console.log(id, title, desc, tags, media)

  let finalBody = {
    title: title,
    description: desc,
    tags: tags,
    media: media,
  };

  let JSONbody = JSON.stringify(finalBody);
  requestEdit(id, JSONbody);
}

async function requestEdit(id, body) {
  try {
    const response = await fetch(`${ALL_LIS_URL}/${id}`, {
      method: "PUT",
      headers: {
        "Content-type": "application/json; charset=UTF-8",
        Authorization: `Bearer ${getToken()}`,
      },
      body: body,
    });

    const data = await response.json();

    if (response.ok) {
      console.log(data);
    } else {
      console.log("oh no" + data);
    }
  } catch (error) {
    console.log(error);
  }
}

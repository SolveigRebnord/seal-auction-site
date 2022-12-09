import dayjs from "dayjs";
import Tagify from "@yaireo/tagify";
import relativeTime from "dayjs/plugin/relativeTime";
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

dayjs.extend(relativeTime);
profileName.innerHTML = getUsername();

function checkAccess(access) {
  if (access === null) {
    window.location.replace("/login.html");
  }
}
checkAccess(getToken())

activeLisBtn.addEventListener("click", myLis);

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
    wins = `<span class="text-2xl">${data.wins.length}</span> wins`;
    if (data.wins.length == 1) {
      wins = `<span class="text-2xl">1</span> win`;
    }
    if (data.wins.length == 0) {
      wins = `<span class="text-2xl">${data.wins.length}</span> wins`;
    }
  }

  if (data.avatar) {
    profileImg = data.avatar;
  }

  if (data.listings) {
    listings = `<span class="text-2xl">${data.listings.length}</span> listings`;

    if (data.listings.length == 1) {
      listings = `<span class="text-2xl">${data.listings.length}</span> listing`;
    }
    if (data.listings.length == 0) {
      listings = `<span class="text-2xl">0</span> listings`;
    }
  }

  myProfile = 
  `<section class="h-fit w-full rounded-md font-light font-quickS md:flex md:flex-col justify-between items-center md:px-6 lg:flex-col lg:w-fit">
      <div class="flex flex-col gap-4 justify-center items-center md:w-1/2">
        <div class="w-2/3 md:w-full h-60 lg:w-72 lg:h-72 rounded-xl shadow-xl bg-cover flex justify-end items-end p-4" style="background-image: url('${profileImg}')">
          <button id="edit_img_btn"><img class="w-6 outline outline-1 outline-white rounded-sm outline-offset-1 hover:outline-2 transition-all ease-in-out duration-100 hover:scale-105" src="/edit_img.png"></button>
        </div>
        <h1 class="font-fjalla tracking-wide text-4xl">${name}</h1>
        <p class="text-sm">${email}</p>
      </div>
      <div class="flex flex-col items-center md:flex-row md:justify-evenly w-full lg:items-center lg:flex-col">
        <p class="flex flex-row gap-3 py-6 text-lg items-center"><img class="w-6" src="/coins.png">${credits}</p>
        <p>${wins}</p>
        <p>${listings}</p>
      </div>
    </section>`;

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
    if (event.target.closest(".edit")) {
      if (event.target.closest(".editOverlay")) {
        return;
      } else {
        editListingOverlay.classList.toggle("hidden");
      }
    }
  },
  false
);

function editImg(e) {
  editImgOverlay.classList.toggle("hidden");

  let imgUrl = e.currentTarget.param;

  editImgOverlay.innerHTML = 
  `<div class="main w-full md:w-1/2 md:ml-32 bg-white md:rounded-lg p-6 flex flex-col items-center shadow-md gap-6 font-quickS lg:w-1/3">
    <p class="text-xl">Current profile image</p>
    <img class="w-32 h-32 object-cover rounded-md outline outline-1 outline-blue outline-offset-2" src='${imgUrl}'>
    <p>Change URL:</p>
    <input id="edit_img_input" type="text" class="w-full h-12 shadow-md px-4 focus-within:select-text" value="${imgUrl}">
    <button id="prew_edit_img" class="clean-button">Preview</button>
    <div class="flex flex-col items-center w-full" id="show_img"></div>
  </div>`;

  let imgInput = document.getElementById("edit_img_input");
  let imgPrewBtn = document.getElementById("prew_edit_img");
  let imgPrew = document.getElementById("show_img");

  imgPrewBtn.addEventListener("click", showImg);

  function showImg() {
    let imgValue = imgInput.value;
    imgPrew.innerHTML = 
    `<img class="w-32 h-32 object-cover rounded-md outline outline-1 outline-blue outline-offset-2" src='${imgValue}'>
    <div class="flex flex-row justify-between gap-6 mt-8">
      <button class="clean-button flex flex-row items-center gap-2 rounded-sm shadow-md" id="reject_img_btn">
        <img class="w-4" src="/x_blue.png">
        Discard image
      </button>
      <button class="clean-button flex flex-row items-center gap-2 bg-blue text-white rounded-sm shadow-md" id="approve_img_btn">
        <img class="w-4" src="/check_white.png">
        Replace
      </button>
    </div>`;

    let approveBtn = document.getElementById("approve_img_btn");
    let discardBtn = document.getElementById("reject_img_btn");

    approveBtn.addEventListener("click", requestImg);
    discardBtn.addEventListener("click", (e) => {
      e.preventDefault();
      imgPrew.innerHTML = "";
    });
    approveBtn.param = imgValue;
  }
}

async function requestImg(e) {

  let imgUrl = e.currentTarget.param;
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
    let ending = lis.endsAt;
    let diff = dayjs().diff(ending, "minute");
    if (diff < 0) {
      activeListings.push(lis);
    }
  }

  if (activeListings.length == 0) {
    activeFeed.innerHTML = 
    `<p class="w-full text-center text-sm font-quickS font-light py-4 italic text-gray-700">
      You have no active listings at the moment
    </p>`;
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
      bidNumber = `<span class="text-xl">${amountOfBids}</span> bids`;

      if (amountOfBids == 1) {
        bidNumber = `${amountOfBids} bid`;
      }

      for (let bid of lis.bids) {
        bidder = bid["bidderName"];
        bids = 
        `<p class="text-3xl">${bid["amount"]} -,</p>    <p class="font-normal">// ${bidder}</p>`;
      }

      if (amountOfBids == 0) {
        bids = `<p class="">None yet, crossing fingers!</p>`;
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

    oneListing = 
    `<div class="w-full p-6 rounded-md bg-white shadow-lg text-sm font-light flex flex-col gap-4 font-quickS">
      <div class="flex flex-col justify-between gap-6">
        <h2 class="text-2xl font-normal">${title}</h2>
        <p class="">${desc}</p>
        <div class="flex flex-row gap-2">
          ${tags}
        </div>
        <div class="flex flex-row overflow-scroll gap-4 h-80">
          ${media}
        </div>
      </div>
      <hr>
      <div class="flex flex-col gap-4 pt-4">
        <p>${endTime}</p>
        <p>Created ${created}</p>
        <div class="pt-4">
          <p>${bidNumber}</p>
          <div class="my-4 w-full flex flex-row justify-between items-baseline border-b border-blue md:w-2/3 m-auto px-4">
            <p>Current bid:</p>
            <div class="flex flex-row gap-4 items-baseline">
              ${bids}
            </div>
          </div>
        </div>
      </div>
    </div>`;

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
//noe?
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
    const response = await fetch(
      `${ALL_PROFILES_URL}/${getUsername()}/bids?sort=created&sortOrder=desc&_listings=true`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      }
    );
    const data = await response.json();
    if (response.ok) {
      console.log(data)
      let activeLisArr = [];
      for (let bid of data) {
        let ending = bid.listing["endsAt"];
        console.log(ending)
      
        let diff = dayjs().diff(ending, "minute");
        if (diff < 0) { 
          console.log(diff)
          activeLisArr.push(bid)
          console.log(activeLisArr)
        }
      }
      if (activeLisArr.length == 0) {
        activeFeed.innerHTML = 
        `<p class="w-full text-center text-sm font-quickS font-light py-4 italic text-gray-700">
          You have no active bids at the moment
        </p>`;

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
  let oneListing;
  let id;
  let amount;
  let allBids = [];
  let newarr;

  for (let lis of array) {
    title = lis.listing.title;

    if (lis.listing.endsAt) {
      let endingTime = new Date(lis.listing.endsAt).getTime();
      let now = dayjs();
      let diff = endingTime - now;
      let days = Math.floor(diff / (1000 * 60 * 60 * 24));
      let hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      let minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      let seconds = Math.floor((diff % (1000 * 60)) / 1000);
      endTime = `${days}d ${hours}h ${minutes}m ${seconds}s`; //enten få til at de går nedover, eller ta vekk sekunder

      let nowTime = dayjs().isAfter(dayjs(lis.listing.endsAt));
      if (nowTime == true) {
        endTime = "Finished";
      }
    }

    if (lis.listing.media) {
      img = lis.listing.media[0];
    }

    amount = lis.amount;

    id = lis.listing.id;

    oneListing = 
    `<a href="listing.html?id=${id}" class="hover:drop-shadow-lg transition duration-800 ease-in-out hover:after:bg-white after:opacity-20">
      <div class="w-full rounded-md bg-white shadow-lg text-right font-light font-robotoC flex flex-row">
        <div class="w-1/2 md:w-1/2 rounded-l-lg bg-cover bg-center" style="background-image: url('${img}')">
        </div>
        <div class="w-1/2 p-4 flex flex-col gap-4 text-sm md:w-1/2 md:p-6">
          <h2 class="text-lg whitespace-nowrap text-ellipsis overflow-hidden ... md:text-xl">${title}</h2>
          <p class="flex flex-row items-center justify-end gap-1 text-sm"><img src="/clock.png" class="w-4"> ${endTime}</p>
          <p>${amount}</p>
        </div>
      </div>
    </a>`;

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
  let bidType;

  for (let lis of array) {

    media = "";

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

    id = lis.id;

    if (lis.bids) {
      amountOfBids = lis.bids.length;
      bidNumber = `<span class="text-xl">${amountOfBids}</span> bids`;

      if (amountOfBids == 1) {
        bidNumber = `${amountOfBids} bid`;
      }

      for (let bid of lis.bids) {
        bidder = bid["bidderName"];
        bids = 
        `<p class="text-3xl">${bid["amount"]} -,</p>
        <p class="font-normal">// ${bidder}</p>`;
      }

      bidType= "Current bid:";
      if (nowTime == true) {
        bidType = "Winning bid";
      }

      if (amountOfBids == 0) {
        bids = `<p class="">None yet, crossing fingers!</p>`;
        bidder = "";
      }
    }

    let oneImg;
    for (let img of lis.media) {
      oneImg = `<img class="rounded-lg w-fit max-w-sm object-cover" src=${img}>`;
      media += oneImg;
    }

    if (lis.tags) {
      tags = [];
      let oneTag;
      for (let tag of lis.tags) {
        oneTag = `<p class="px-2 py-1 rounded-sm bg-blue w-fit h-fit text-white">${tag}</p>`;
        tags += oneTag;
      }
    }

    oneListing = 
    `<div class="w-full p-6 rounded-md bg-white shadow-lg text-sm font-light flex flex-col gap-4 font-quickS">
      <div class="flex flex-col justify-between gap-6">
        <h2 class="text-2xl font-normal">${title}</h2>
        <p class="">${desc}</p>
        <div class="flex flex-row gap-2">
          ${tags}
        </div>
        <div class="flex flex-row overflow-scroll gap-4 h-80 ">
          ${media}
        </div>
      </div>
      <hr>
      <div class="flex flex-col gap-4 pt-4">
        <p>${endTime}</p>
        <p>Created ${created}</p>
        <div class="pt-4">
          <p>${bidNumber}</p>
          <div class="my-4 w-full flex flex-row justify-between items-baseline border-b border-blue md:w-2/3 m-auto px-4">
            <p>${bidType}</p>
            <div class="flex flex-row gap-4 items-baseline">
              ${bids}
            </div>
          </div>
        </div>
      </div>
      <div class="flex wrap flex-row justify-center gap-8 mt-6">
        <button id="${id}" class="deleteBtn outline outline-1 outline-black outline-offset-4 p-1 rounded-sm">
          <img class="w-6" src="/trash.png">
        </button>
        <button id="${id}" class="editBtn outline outline-1 outline-black outline-offset-4 p-1 rounded-sm">
          <img class="w-6" src="/edit.png">
        </button>
      </div>
    </div>`;

    myListings.innerHTML += oneListing;

    const deleteButtons = document.getElementsByClassName("deleteBtn");

    const editButtons = document.getElementsByClassName("editBtn");

    for (let button of editButtons) {
      button.addEventListener("click", (event) => {
        event.preventDefault();
        editListingOverlay.classList.toggle("hidden")
        getListing(button.id)
      });
    }
   
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
  }
}

  async function getListing(id) {
    try {
      const response = await fetch(
        `${ALL_LIS_URL}/${id}?_seller=true&_bids=true`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        }
      );
      const data = await response.json();
      if (response.ok) {
       let editTitle = data.title;
       let editDesc = data.description;
       let editTags = data.tags;
       let editMedia = data.media;
       console.log("ok")
       editListing(id, editTitle, editDesc, editTags, editMedia) 

      } else {
        console.log("error", data);
      }
    } catch (error) {
      console.log(error);
    }
  }

function editListing(id, title, desc, tags, media) {


  function leaveEdit() {
    if (editListingOverlay.classList.contains("hidden")) {
      let doubleCheck = confirm("You sure? Your edits will be lost");
      if (doubleCheck == true) {
        return;
      }
    }
  }
  leaveEdit();

  editListingOverlay.innerHTML = 
  `<form
  class="editOverlay p-6 py-8 md:shadow-none flex flex-col w-1/2 bg-white gap-8 md:gap-8 font-quickS font-light lg:justify-center lg:items-center lg:ml-20">
  <div class="flex flex-col w-full gap-4 lg:w-2/3 lg:justify-between lg:gap-8">
    <div>
      <input
        type="text"
        name="title"
        id="title"
        placeholder="title"
        required
        value="${title}"
        class=" font-quickS pl-4 tracking-wide font-light placeholder:text-black text-2xl focus:outline-none bg-transparent"
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
      <span id="img_error_message" class="hidden m-auto w-fit">Insert a image url!</span>
      <button class="addImg clean-button w-28 text-sm ml-auto -mt-6">Add image</button>
    </div>
  </div>  
  <ul
  class="flex flex-row flex-wrap gap-4 justify-center"
  id="prew_img"></ul>
  <div class="flex flex-col md:flex-row gap-4 items-center w-full justify-center">
    <button class="discardChangeBtn clean-button flex flex-row items-center gap-2 rounded-sm shadow-md">
      <img class="w-4" src="/x_blue.png">
      Discard changes
    </button>
    <button class="submitChangeBtn clean-button flex flex-row items-center gap-2 bg-blue text-white rounded-sm shadow-md">
      <img class="w-4" src="/check_white.png">
      Submit changes
    </button>
  </div>
</form>`;

  const previewImg = document.getElementById("prew_img");
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

  let onePrew = "";

  function testImg() {
    previewImg.innerHTML = "";
    for (let img of media) {
      onePrew = 
      `<li class="li list-none cursor-pointer relative sm:after:content-['X'] after:content-['X'] after:font-quickS after:text-sm after:flex after:justify-center after:items-center after:p-2 after:absolute after:-top-2 after:-right-2 after:w-6 after:h-6 after:bg-blue after:text-white after:drop-shadow-md after:rounded-full hover:drop-shadow-lg transition-all duration-100 ease-in md:after:content-none md:hover:after:content-['X']">
        <img class="w-40 h-40 object-cover rounded-md" src=${img}>
      </li>`;

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

  let addImgBtns = document.getElementsByClassName("addImg");
  for (let btn of addImgBtns) {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      let imgURL = media_input.value;
      if (media_input.value == "") {
        document.getElementById("img_error_message").classList.toggle("hidden");
        return;
      }
      media.push(imgURL);
      media_input.value = "";
      document.getElementById("img_error_message").classList.toggle("hidden");
      testImg();
    });
  }

  function removeImg(e) {
    let index = e.currentTarget.param;
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

  let discardChangeBtns = document.getElementsByClassName("discardChangeBtn");
  for (let btn of discardChangeBtns) {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      editListingOverlay.classList.toggle("hidden");
      leaveEdit();
    });
  }

  let submitChangeBtns = document.getElementsByClassName("submitChangeBtn");
  for (let btn of submitChangeBtns) {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      editBody(id, titleValue, descValue, tags, media);
    });
  }
}

function editBody(id, title, desc, tags, media) {

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
      window.location.reload();
    } else {
      console.log("oh no" + data);
    }
  } catch (error) {
    console.log(error);
  }
}


//Kode for eventuell lsiting av bids
   /*
    if (lis.listing.bids !== "") {
      let oneBid;
      let lengde = lis.listing.bids.length;
      let lastIndex = lengde - 1;
      lastItem = lis.listing.bids.slice(lastIndex);

      for (let bid of lis.listing.bids) {
        let bidderName = bid["bidderName"];
        if (bidderName == getUsername()) {
          bidderName = "Me";
        }
        oneBid = 
        `<div class="flex flex-row justify-between items-center gap-2 text-gray-400 last-of-type:bg-white last-of-type:text-black last-of-type:outline-2 last-of-type:outline last-of-type:outline-blue last-of-type:p-2 last-of-type:px-3">
          <p>${bidderName}</p>
          <p>${bid["amount"]}</p>
        </div>`;

        allBids.push(oneBid);
        newarr = allBids.join(" ");
      }
    }

         <div class="flex flex-col gap-2">
            ${newarr}
          </div>
    
    */
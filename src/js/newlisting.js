import { getUsername, getToken } from "./ingredients/storage";
import dayjs from "dayjs";
import { ALL_LIS_URL } from "./ingredients/endpoints";
import Tagify from "@yaireo/tagify";
import relativeTime from "dayjs/plugin/relativeTime";

const profileName = document.getElementById("profile_name");
const mediaInput = document.getElementById("media_input");
const mediaBtn = document.getElementById("media_button");
const prew = document.getElementById("show_img");
const newListing = document.getElementById("preview-section");
const previewBtn = document.getElementById("preview_listing");
const prewImgUL = document.getElementById("img_prew_ul");
const title = document.getElementById("title");
const desc = document.getElementById("desc");
const endingTime = document.getElementById("endingTime");
const errorTitle = document.getElementById("title-message");
const errorDesc = document.getElementById("desc-message");
const errorTime = document.getElementById("time-message");

let tagArray = [];
let mediaArray = [];
const input = document.querySelector("input[name=tags]");
let prewiew;
let onePrew;

let validTitle;
let validDesc;
let validTime;

dayjs.extend(relativeTime);
profileName.innerHTML = getUsername();

function checkAccess(access) {
  if (access === null) {
    window.location.replace("/login.html");
  }
}
checkAccess(getToken());

new Tagify(input, {
  originalInputValueFormat: (valuesArr) =>
    valuesArr.map((item) => item.value).join(","),
});
input.addEventListener("change", onChange);

function onChange(e) {
  let stringList = e.target.value;
  tagArray = stringList.split(",");
}

mediaBtn.addEventListener("click", (e) => {
  e.preventDefault();

  if (mediaInput.value == "") {
    return;
  } else {
    prewiew = `<div class="flex justify-center items-center flex-col gap-2">
      <img class="w-40 h-40 object-cover drop-shadow-md rounded-md" src="${mediaInput.value}">
      <button class="px-4 py-2 shadow-lg" id="approve_img_btn">Add image</button>
    </div>`;

    prew.innerHTML = prewiew;
    prew.classList.toggle("hidden");
  }

  let addImg = document.getElementById("approve_img_btn");
  addImg.addEventListener("click", (e) => {
    e.preventDefault();
    let currentImg = mediaInput.value;
    mediaArray.push(currentImg);
    imgRe();
  });
});

function imgRe() {
  prew.innerHTML = "";
  prewImgUL.innerHTML = "";

  if (mediaArray === []) {
    prewImgUL.innerHTML = "zero";
  }
  for (let img of mediaArray) {
    onePrew = `<li class="li list-none cursor-pointer relative sm:after:content-['X'] after:content-['X'] after:font-quickS after:text-sm after:flex after:justify-center after:items-center after:p-2 after:absolute after:-top-2 after:-right-2 after:w-6 after:h-6 after:bg-blue after:text-white after:drop-shadow-md after:rounded-full hover:drop-shadow-lg transition-all duration-100 ease-in lg:after:content-none lg:hover:after:content-['X']">
    <img class="w-32 h-32 object-cover rounded-md" src=${img}>
  </li>`;
    prewImgUL.innerHTML += onePrew;
  }
  let allLis = document.querySelectorAll(".li");
  for (var i = 0; i < allLis.length; i++) {
    var img = allLis[i];
    img.addEventListener("click", removeImg);
    img.param = i;
  }
  prew.classList.toggle("hidden");
  mediaInput.value = "";
}

function removeImg(e) {
  let index = e.currentTarget.param;
  mediaArray.splice(index, 1);
  imgRe();
}

function checkValidform() {
  if (title.value == "") {
    validTitle = false;
    errorTitle.classList.remove("hidden");
  } else {
    validTitle = true;
    errorTitle.classList.add("hidden");
  }

  if (desc.value == "") {
    validDesc = false;
    errorDesc.classList.remove("hidden");
  } else {
    validDesc = true;
    errorDesc.classList.add("hidden");
  }

  if (endingTime.value == "") {
    validTime = false;
    errorTime.classList.remove("hidden");
  } else {
    validTime = true;
    errorTime.classList.add("hidden");
  }

  if (validDesc && validTime && validTitle == true) {
    return true;
  } else {
    return false;
  }
}

previewBtn.addEventListener("click", (e) => {
  e.preventDefault();
  if (checkValidform() == true) {
    newListing.classList.toggle("hidden");
    input.removeAttribute("autofocus");
    showPreview(
      title.value,
      desc.value,
      tagArray,
      mediaArray,
      endingTime.value
    );
  } else {
    return;
  }
});

function showPreview(title, desc, tags, media, endTime) {
  let showTime = dayjs(endTime).format("DD/MM/YYYY HH:mm:ss");
  let fromNow = dayjs(endTime).fromNow();
  let oneImg = "";
  let allImgs = "";
  let oneTag = "";
  let allTags = "";

  for (let img of media) {
    oneImg = `<li>
      <img class="w-40 h-40 rounded-sm shadow-md object-cover" src=${img}>
    </li>`;
    allImgs += oneImg;
  }

  for (let tag of tags) {
    oneTag = `<li class="px-2 py-1 border border-gray-300 rounded-sm">${tag}</li>`;
    allTags += oneTag;
  }

  let fullPreview = `<div class="thingy h-fit font-robotoC font-light bg-bgGrey rounded-md px-4 py-8 shadow-lg w-full m-8 md:w-2/3 md:m-auto md:mr-28 md:mt-1/2 md:p-14 lg:w-1/3 lg:m-auto">
    <div class="flex flex-col gap-4 w-full">
      <h3 class="text-2xl font-quickS">${title}</h3>
      <hr>
      <p>${desc}</p>
      <ul class="flex flex-row gap-4 flex-wrap">${allTags}</ul>
      <div class="flex flex-row justify-between items-center border border-blue p-2 px-4 rounded-md">
        <p class="tracking-wide font-quickS">${showTime}</p>
        <p class="text-gray-500 text-xs">${fromNow}</p>
      </div>
      <ul class="flex flex-col gap-4 justify-center items-center lg:flex-row lg:flex-wrap">
      ${allImgs}
    </ul>
    </div>
    <div class="flex flex-col justify-between text-sm font-robotoC font-light items-center pt-12 px-4 gap-8">
      <div class="flex flex-col items-center justify-center gap-4 text-lg">Looking good!
        <button id="post_listing" class="flex flex-row gap-2 border border-black rounded-md px-6 py-2 uppercase font-cuprum tracking-wider font-normal items-center text-sm">
          <img class="w-4" src="/check.svg">
          <p>Post</p>
        </button>
      </div>
      <div class="flex flex-col items-center gap-4">Need some more editing
        <button id="exit_preview" class="flex flex-row gap-2 uppercase font-cuprum tracking-wider font-normal items-center ">
          <img class="w-4" src="/back.png">
          <p>Back</p>
        </button>
      </div> 
    </div>
  </div>`;

  newListing.innerHTML = fullPreview;

  document
    .getElementById("exit_preview")
    .addEventListener("click", closeOverlay);
  document
    .getElementById("post_listing")
    .addEventListener("click", createRequest);
}

document.addEventListener(
  "click",
  function (event) {
    if (event.target.closest(".modal")) {
      if (event.target.closest(".thingy")) {
        return;
      } else {
        closeOverlay();
      }
    }
  },
  false
);

function closeOverlay() {
  newListing.classList.toggle("hidden");
}

function createRequest() {
  let finTitle = title.value;
  let finDesc = desc.value;
  let finTags = tagArray;
  let finImg = mediaArray;
  let finEndTime = endingTime.value;

  let reqBody = {
    title: finTitle,
    description: finDesc,
    tags: finTags,
    media: finImg,
    endsAt: finEndTime,
  };

  let bodyJSON = JSON.stringify(reqBody);
  requestListing(bodyJSON);
}

async function requestListing(body) {
  try {
    const response = await fetch(ALL_LIS_URL, {
      method: "POST",
      headers: {
        "Content-type": "application/json; charset=UTF-8",
        Authorization: `Bearer ${getToken()}`,
      },
      body: body,
    });
    const data = await response.json();
    if (response.ok) {
      window.location.replace("myprofile.html");
    } else {
      console.log("oh no" + data);
    }
  } catch (error) {
    console.log(error);
  }
}

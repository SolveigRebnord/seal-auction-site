import { getUsername, getToken } from "./ingredients/storage";
import dayjs from "dayjs";
import { ALL_LIS_URL } from "./ingredients/endpoints";
import Tagify from '@yaireo/tagify'
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

const profileName = document.getElementById("profile_name");
const tagsInput = document.getElementById("tags");
const tagSpan = document.getElementById("tags_array");
const ul = document.querySelector("ul");
const mediaInput = document.getElementById("media_input");
const mediaBtn = document.getElementById("media_button");
const prew = document.getElementById("show_img");
const newListing = document.getElementById("preview-section");
const previewBtn = document.getElementById("preview_listing");
const prewImgUL = document.getElementById("img_prew_ul")

const title = document.getElementById("title");
const desc = document.getElementById("desc");
const endingTime = document.getElementById("endingTime");

profileName.innerHTML = getUsername();

let tagArray = [];
let mediaArray = [];



var input = document.querySelector('input[name=tags]');

new Tagify(input, {
  originalInputValueFormat: valuesArr => valuesArr.map(item => item.value).join(',')
})

input.addEventListener('change', onChange)


function onChange(e){
  let stringList = e.target.value;
  tagArray = stringList.split(",")
  console.log(tagArray)
}


    

let prewiew;
let onePrew;

mediaBtn.addEventListener("click", (e) => {
  e.preventDefault();
  console.log(mediaInput.value);
  if (mediaInput.value == "") {
    return;
  }
  else {
  prewiew = `<img src="${mediaInput.value}">
  <button id="approve_img_btn">Add image</button>`;
  prew.innerHTML = prewiew;
  prew.classList.toggle("hidden");
  }

  let addImg = document.getElementById("approve_img_btn");
  addImg.addEventListener("click", (e) => {
    e.preventDefault();
    let currentImg = mediaInput.value;
    mediaArray.push(currentImg);
    imgRe();
  })


});


function imgRe() {

  prew.innerHTML = "";
  prewImgUL.innerHTML = "";

  if (mediaArray === []) {
    prewImgUL.innerHTML = "zero"
  }

  for (let img of mediaArray) {
    onePrew = `<li class="li"><img class="w-20 h-20" src=${img}></li>`;
    prewImgUL.innerHTML += onePrew;
  }
 

  

  let allLis = document.querySelectorAll(".li")

  for (var i = 0; i < allLis.length; i++) {
    var img = allLis[i]
    img.addEventListener("click", removeImg)
    img.param = (i)
  }

  prew.classList.toggle("hidden");
  mediaInput.value = "";
}



function removeImg(e) {
  let index = e.currentTarget.param;
  console.log(index)
  mediaArray.splice(index)
  console.log(mediaArray)
  imgRe()
}




previewBtn.addEventListener("click", (e) => {
  e.preventDefault();
  newListing.classList.toggle("hidden");

  input.removeAttribute("autofocus")
  showPreview(
    title.value,
    desc.value,
    tagArray,
    mediaArray,
    endingTime.value
  );
});

//  <h2 class="text-3xl font-lobster2 pb-8 self-center">Preview<h2>
function showPreview(title, desc, tags, media, endTime) {
  let showTime = dayjs(endTime).format("DD/MM/YYYY HH:mm:ss");
  let fromNow = dayjs(endTime).fromNow();
  console.log(tagArray)

  let oneImg;
  let allImgs;

  for (let img of media) {
    oneImg = `<img class="w-20 h-20" src=${img}>`
  }
  allImgs += oneImg;

  let oneTag;
  let allTags;

  for (let tag of tagArray) {
    oneTag = `<p>${tag}</p>`;
    allTags += oneTag;
  }



  let fullPreview = `<div class="thingy bg-bgGrey rounded-md px-4 py-8 shadow-lg m-auto md:w-2/3 md:mr-12 md:mt-1/2 md:p-14 lg:m-auto lg:w-1/3 h-fit font-robotoC font-light">
      
        <div class="flex flex-col gap-4">
            <div>${allImgs}</div>
            <h3 class="text-2xl font-quickS">${title}</h3>
            <p>${desc}</p>
            <p>${allTags}</p>
            <div class="flex flex-row justify-between items-center border border-blue p-2 px-4 rounded-md">
                <p class="tracking-wide font-quickS">${showTime}</p>
                <p class="text-gray-500 text-xs">${fromNow}</p>
            </div>
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

        </div>
        `;
  console.log(fullPreview);
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

  const reqBody = {
    title: finTitle,
    description: finDesc,
    tags: finTags,
    media: finImg,
    endsAt: finEndTime,
  };
  console.log(reqBody);
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
      console.log(data);
    } else {
      console.log("oh no" + data);
    }
  } catch (error) {
    console.log(error);
  }
}

/*
function createTag(){
    ul.querySelectorAll("li").forEach(li => li.remove());
    tagArray.slice().reverse().forEach(tag =>{
        let liTag = `<li>${tag} <i class="uit uit-multiply" onclick="remove(this, '${tag}')"></i></li>`;
        ul.insertAdjacentHTML("afterbegin", liTag);
    });

}


function remove(element, tag){
    let index  = tagArray.indexOf(tag);
    tagArray = [...tagArray.slice(0, index), ...tagArray.slice(index + 1)];
    element.parentElement.remove();

}
*/

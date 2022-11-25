import { getUsername, getToken } from "./ingredients/storage";
import dayjs from "dayjs";
import { ALL_LIS_URL } from "./ingredients/endpoints";

import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);


const profileName = document.getElementById("profile_name");
const tagsInput = document.getElementById("tags")
const tagSpan = document.getElementById("tags_array")
const ul = document.querySelector("ul");
const mediaInput = document.getElementById("media_input")
const mediaBtn = document.getElementById("media_button")
const prew = document.getElementById("show_img")
const newListing = document.getElementById("preview-section")
const previewBtn = document.getElementById("preview_listing")

const title = document.getElementById("title")
const desc = document.getElementById("desc")
const endingTime = document.getElementById("endingTime")





profileName.innerHTML = getUsername();

let tagArray = [];

tagsInput.addEventListener("keyup", () => {
    if (tagsInput.value.endsWith(',')) {
        let tag = tagsInput.value.slice(0,-1);
        tagArray.push(tag)
        tagsInput.value = "";
        tagSpan.innerHTML = tagArray;
    }
})

let prewiew;



mediaBtn.addEventListener("click", (e) => {
    e.preventDefault();
    console.log(mediaInput.value)
    prewiew = `<img src="${mediaInput.value}">`
    prew.innerHTML = prewiew;
    prew.classList.toggle("hidden")
})

mediaInput.addEventListener("", () => {
    if (tagsInput.value.endsWith(',')) {
        let tag = tagsInput.value.slice(0,-1);
        tagArray.push(tag)
        tagsInput.value = "";
        tagSpan.innerHTML = tagArray;
    }
})

previewBtn.addEventListener("click", (e) => {
e.preventDefault();
    newListing.classList.toggle("hidden");
    showPreview(title.value, desc.value, tagsInput.value, mediaInput.value, endingTime.value)
})


//  <h2 class="text-3xl font-lobster2 pb-8 self-center">Preview<h2>
    function showPreview(title, desc, tags, media, endTime) {

        let showTime = dayjs(endTime).format('DD/MM/YYYY HH:mm:ss')
        let fromNow = dayjs(endTime).fromNow()

        let fullPreview = 
        `<div class="thingy bg-bgGrey rounded-md px-4 py-8 shadow-lg m-auto md:w-2/3 md:mr-12 md:mt-1/2 md:p-14 lg:m-auto lg:w-1/3 h-fit font-robotoC font-light">
      
        <div class="flex flex-col gap-4">
            <img class="lg:w-4/5 max-h-60 self-center rounded-md md:w-full" src="${media}">
            <h3 class="text-2xl font-quickS">${title}</h3>
            <p>${desc}</p>
            <p>${tags}</p>
            <div class="flex flex-row justify-between items-center border border-blue p-2 px-4 rounded-md">
                <p class="tracking-wide font-quickS">${showTime}</p>
                <p class="text-gray-500 text-xs">${fromNow}</p>
            </div>
        </div>
            <div class="flex flex-col justify-between text-sm font-robotoC font-light items-center pt-12 px-4 gap-8">
            <div class="flex flex-col items-center justify-center gap-4 text-lg">Looking good!
                <button id="post_listing" class="flex flex-row gap-2 border border-black rounded-md px-6 py-2 uppercase font-cuprum tracking-wider font-normal items-center text-sm">
                    <img class="w-4" src="../img/check.svg">
                    <p>Post</p>
                </button>
            </div>
            <div class="flex flex-col items-center gap-4">Need some more editing
                <button id="exit_preview" class="flex flex-row gap-2 uppercase font-cuprum tracking-wider font-normal items-center ">
                    <img class="w-4" src="../img/back.png">
                    <p>Back</p>
                </button>
            </div>
         
                
            </div>

        </div>
        `
        console.log(fullPreview)
        newListing.innerHTML = fullPreview;

     
        document.getElementById("exit_preview").addEventListener("click", closeOverlay)
        document.getElementById("post_listing").addEventListener("click", createRequest)
  

    }

    document.addEventListener(
        "click",
        function (event) {
          if (event.target.closest(".modal")) {
            if (event.target.closest(".thingy")) {
                return;
            }
            else {
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
    let finTitle = title.value
    let finDesc = desc.value
    let finTags = tagsInput.value
    let finImg = mediaInput.value
    let finEndTime = endingTime.value

    const reqBody = {
        "title": finTitle,
        "description": finDesc, 
        "tags": [finTags], 
        "media": [finImg],
        "endsAt": finEndTime
      }
      console.log(reqBody)
      let bodyJSON = JSON.stringify(reqBody);
      requestListing(bodyJSON)
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

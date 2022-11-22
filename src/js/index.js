console.log("hei");

import { ALL_LIS_URL } from "./ingredients/endpoints";
import dayjs from "dayjs";

import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

const feed = document.getElementById("feed");

async function allLis() {
  try {
    const response = await fetch(`${ALL_LIS_URL}?_seller=true&_bids=true`, {
      method: "GET",
    });

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

function listLis(data) {
  //console.log(data);

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
        bids = bid["amount"];
      }
    }

    if (lis.endsAt) {
      let endingTime = new Date(lis.endsAt).getTime();
      let now = dayjs();
      let diff = now - endingTime;
      let days = Math.floor(diff / (1000 * 60 * 60 * 24));
      let hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      let minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      let seconds = Math.floor((diff % (1000 * 60)) / 1000);
      endsAt = `${days}d ${hours}h ${minutes}m ${seconds}s`; //enten få til at de går nedover, eller ta vekk sekunder
    }

    /*
         <p class="flex flex-row items-center gap-2 text-sm font-josefine font-extralight w-max">
                              ${updated}
                          </p>

                            <figure>
                            ${sellerImg}
                        </figure>
                            <p class="">${seller}</p>
                            <p class="flex flex-row items-center gap-2 font-josefine text-sm font-light w-max">
                                ${created}
                            </p>
                             <p class="font-light text-sm py-4">${desc}</p>
                            <ul>${tags}</ul>
                             <p>${amountOfBids}</p>
                            <p>${bids}</p>
                        <button class="px-10 py-4 text-xs uppercase rounded-sm tracking-wider text-white bg-blue shadow-md ">Make a bid</button>
    */

    oneLi = `<div class=" h-fit w-full lg:w-fit lg:bg-inherit font-quickS text-sm">
             
            <div class="w-80 h-96 rounded-md bg-cover bg-center" style="background-image: url('${lis.media}')">
               <a href="listing.html?id=${id}" class="w-full h-full flex items-end">
                <div class="w-full h-1/2 bg-lightBlue flex flex-col shadow-lg p-2">
                  <h2 class="text-2xl font-light font-sans text-white tracking-wide ">${title}</h2>
                  <p class="text-xs pt-4 font-light">Ends in ${endsAt}</p>
                </div>
                </a>
            </div>
                
 
                           
                        </a>
                        </div>
                `;

    feed.innerHTML += oneLi;
  }
}

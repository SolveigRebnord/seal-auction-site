

import { ALL_PROFILES_URL } from "./ingredients/endpoints";

import { getUsername,getToken } from "./ingredients/storage";

const profileInfo = document.getElementById("profile_info");

async function myProfile() {
    try {
      const response = await fetch(`${ALL_PROFILES_URL}/${getUsername()}?_listings=true`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      });
  
      const data = await response.json();
  
      if (response.ok) {
        console.log(data);
        listProfile(data)

      } else {
        console.log("error", data);
      }
    } catch (error) {
      console.log(error);
    }
  }

myProfile();

function listProfile(data) {

    let myProfile;
    let name;
    let email;
    let profileImg;
    let credits;
    let wins = [];
    let listings = [];

    if (data.name) {
        name = data.name
    }

    if (data.email) {
        email = data.email
    }
    

    if (data.credits) {
        credits = data.credits
    }

    if (data.wins) {
        wins = data.wins
        if (data.wins.length == 0) {
            wins = 0;
        }
    }

    if (data.listings) {
        listings = data.listings 
        if (data.listings.length == 0) {
            listings = 0;
        }
    }


    myProfile = `
    <section class="h-fit rounded-md font-light font-quickS md:flex md:flex-row-reverse shadow-lg justify-between items-center md:p-6 lg:flex-col lg:shadow-none lg:p-0">
    <div class=" flex flex-col gap-2 justify-center items-center">
    <img class=" max-w-xxs object-cover max-h-60 rounded-xl shadow-xl " src="../img/profile_img.jpg">
        <h1 class="font-lobster2 tracking-wide text-4xl">${name}</h1>
        <p class="text-sm">${email}</p>
    </div>
    <div class="flex flex-col items-center md:items-start lg:items-center">
        <p class="flex flex-row gap-3 py-6 text-lg items-center"><img class="w-6" src="../img/coins.png">${credits}</p>
        <p>${wins} wins</p>
        <p>${listings} listings</p>
    <div>
 
    </section>
    `
    profileInfo.innerHTML = myProfile
}

function activeSection(data) {

    let activeList;
    let activeListings;
    let activeBids;


}


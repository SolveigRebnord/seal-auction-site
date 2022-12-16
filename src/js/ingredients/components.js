const searchInput = document.getElementById("search_input");

const theArr = [];

function sendposts(posts) {
  for (let post of posts) {
    theArr.push(post);
  }
  return theArr;
}

function searching() {
  let input, filter, ul, title, txtValue, id, img;
  input = searchInput;
  filter = input.value.toUpperCase();
  ul = theArr;
  let showList = [];

  for (let item of ul) {
    title = item.title;
    id = item.id;
    if (item.media.length == 0) {
      img = "/no_img.svg";
    } else {
      img = item.media[0];
    }

    txtValue = title;
    if (txtValue.toUpperCase().indexOf(filter) > -1) {
      let element = `<a href="post.html?id=${id}">
          <li class="list-none bg-white p-2 w-full flex flex-row gap-6 justify-between items-center text-light font-quickS text-sm border border-gray-300 rounded-md hover:shadow-lg">
            <p class="">${title}</p>
            <img class="w-24 h-24 rounded-md object-cover" src="${img}">
          </li>
        </a>`;

      showList.push(element);
      showSearch.classList.replace("hidden", "flex");
      let newarr = showList.join(" ");
      showSearch.innerHTML = newarr;
    } else {
      console.log("fail");
    }
  }

  if (input.value == "") {
    showSearch.innerHTML = "";
    showSearch.classList.replace("flex", "hidden");
  }
}

export { searching, sendposts };

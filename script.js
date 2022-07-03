const searchInput = document.querySelector(".menu__search-input");
const menuContainer = document.querySelector(".menu__container");
const selectedItems = document.querySelector(".menu__selected-item-group");

async function requestToGithub() {
  let url = new URL("https://api.github.com/search/repositories");
  if (searchInput.value == "") {
    menuContainer.innerHTML = "";
    return;
  }

  url.searchParams.append("q", searchInput.value);
  try {
    let response = await fetch(url);
    if (response.ok) {
      let repositories = await response.json();
      showResponseFromGithub(repositories);
    } else return null;
  } catch (error) {
    return null;
  }
}

function showResponseFromGithub(repositories) {
  menuContainer.innerHTML = "";
  for (let i = 0; i < 5; i++) {
    let name = repositories.items[i].name;
    let owner = repositories.items[i].owner.login;
    let stars = repositories.items[i].stargazers_count;
    let menuContent = `<div class="menu__content" data-owner="${owner}" data-stars="${stars}">${name}</div>`;
    menuContainer.innerHTML += menuContent;
  }
}

function addSelectedItem(item) {
  let name = item.textContent;
  let owner = item.dataset.owner;
  let stars = item.dataset.stars;
  selectedItems.innerHTML += `<div class="menu__selected-item">
    Name: ${name}<br>
    Owner: ${owner}<br>
    Stars: ${stars}
    <button class="menu__btn-close"></button>
    </div>`;
}

function debounce(fn, timeout) {
  let timer = null;

  return (...args) => {
    clearTimeout(timer);
    return new Promise((resolve) => {
      timer = setTimeout(() => resolve(fn(...args)), timeout);
    });
  };
}

let debounceRequest = debounce(requestToGithub, 500);
searchInput.addEventListener("input", debounceRequest);

selectedItems.addEventListener("click", function (event) {
  let target = event.target;
  if (!target.classList.contains("menu__btn-close")) return;
  target.parentElement.remove();
});

menuContainer.addEventListener("click", function (event) {
  let target = event.target;
  if (!target.classList.contains("menu__content")) {
    return;
  }
  addSelectedItem(target);
  searchInput.value = "";
  menuContainer.innerHTML = "";
});

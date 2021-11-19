const monsterURL = "http://localhost:3000/monsters/?_limit=50";

// fetch function: get all monsters, 50 per page
function fetchMonsters(page) {
  return fetch(`${monsterURL}&_page=${page}`).then((resp) => resp.json());
}

function renderMonster(monster) {
  // define consts
  const monsterContainer = document.getElementById("monster-container");
  const monsterDiv = document.createElement("div");

  const monsterName = document.createElement("h2");
  const monsterAge = document.createElement("h4");
  const monsterInfo = document.createElement("p");

  // set attributes for monster div
  monsterDiv.id = "monster.id";
  monsterDiv.className = "monster-div";

  // set text for monster name
  monsterName.textContent = `${monster.name}`;

  // set text for monster age
  monsterAge.textContent = `${monster.age}`;

  // set text for monster info
  monsterInfo.textContent = `${monster.description}`;

  // append name, age, info to div
  // append monster div to container
  monsterDiv.append(monsterName, monsterAge, monsterInfo);
  monsterContainer.append(monsterDiv);
}

function renderForm() {
  // form for creating new monster, appended to create monster container
  const monsterForm = document.createElement("form");
  const createMonsterContainer = document.querySelector("#create-monster");

  // add three input elements, add their innerHTML/text and append to form
  const nameField = document.createElement("input");
  Object.assign(nameField, {
    name: "name",
    placeholder: "name...",
  });

  const ageField = document.createElement("input");
  Object.assign(ageField, {
    name: "age",
    placeholder: "age...",
  });

  const descriptionField = document.createElement("input");
  Object.assign(descriptionField, {
    name: "description",
    placeholder: "description...",
  });

  // create submit btn
  const createBtn = document.createElement("button");
  createBtn.innerHTML = "Create";
  createBtn.id = "create-btn";
  // append inputs and btn to form, and form to container
  createMonsterContainer.append(monsterForm);
  monsterForm.append(nameField, ageField, descriptionField, createBtn);
  //add eventlistener, on submit invoke createMonster
  monsterForm.addEventListener("submit", (e) => {
    // prevent default page reload
    e.preventDefault();
    // create monster
    const newMonster = createMonster(e.target);

    // add new monster to list
    const monsterContainer = document.getElementById("monster-container");
    console.log(newMonster);
    postNewMonster(newMonster);
    // clear input forms
    monsterForm.reset();
  });
}

// function create new monster
function createMonster(form) {
  // gather input value from all input boxes
  return {
    name: form.name.value,
    age: form.age.value,
    description: form.description.value,
  };
}

// function POST new monster
function postNewMonster(monster) {
  let url = monsterURL;
  let details = {
    method: "POST",
    headers: {
      "Content-type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(monster),
  };
  fetch(url, details)
    .then((resp) => resp.json())
    .then((resp) => renderMonster(resp));
}

function appendNewMonster(resp) {
  const monsterContainer = document.getElementById("monster-container");
  monsterContainer.append(resp);
}

function loadNextPage() {
  // find current page index
  const page = parseInt(window.localStorage.getItem("page") || "0") + 1;
  const monsterContainer = document.getElementById("monster-container");
  // load monsters
  fetchMonsters(page)
    // on success (Promise)
    .then((monsters) => {
      // clear current list of monsters
      monsterContainer.innerHTML = "";
      // render next 50 monsters
      monsters.forEach(renderMonster);
      // update current page
      window.localStorage.setItem("page", page);
    });
}

function loadPreviousPage() {
  // find current page
  const page = parseInt(window.localStorage.getItem("page") || "1") - 1;
  if (page > 0) {
    // load monsters
    fetchMonsters(page - 1)
      // on success (Promise)
      .then((monsters) => {
        const monsterContainer = document.getElementById("monster-container");
        // clear current list of monsters
        // render prev 50 monsters
        monsters.forEach(renderMonster);
        // update current page
        window.localStorage.setItem("page", page);
      });
  }
}

// next/previous page buttons
function initPageNavigation() {
  const forwardBtn = document.querySelector("#forward");
  const backBtn = document.querySelector("#back");

  forwardBtn.addEventListener("click", (e) => loadNextPage());
  backBtn.addEventListener("click", (e) => loadPreviousPage());
}

// initialize
function init() {
  // init current page
  const page = window.localStorage.getItem("page") || "1";
  window.localStorage.setItem("page", page);
  renderForm();
  fetchMonsters(page).then((monsters) => monsters.forEach(renderMonster));
  initPageNavigation();
}

document.addEventListener("DOMContentLoaded", init);

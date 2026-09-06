import {
  getUserIds,
  calculateRevisionDates,
  getUpcomingAgendaItems
} from "./common.mjs";

import {
  getData,
  addData
} from "./storage.mjs";


// ----------------------------------------
// DOM ELEMENTS
// ----------------------------------------

const userSelect = document.querySelector("#user-select");
const agenda = document.querySelector("#agenda");
const emptyMessage = document.querySelector("#empty-message");
const topicForm = document.querySelector("#topic-form");
const topicInput = document.querySelector("#topic");
const learnedDateInput = document.querySelector("#learned-date");


// ----------------------------------------
// SET TODAY'S DATE
// ----------------------------------------

function setDefaultDate() {
  const today = new Date();
  learnedDateInput.value = today.toISOString().split("T")[0];
}


// ----------------------------------------
// CREATE THE 5 USER OPTIONS
// ----------------------------------------

function populateUsers() {
  const userIds = getUserIds();

  userIds.forEach((userId) => {
    const option = document.createElement("option");

    option.value = userId;
    option.textContent = `User ${userId}`;

    userSelect.appendChild(option);
  });
}


// ----------------------------------------
// DISPLAY A USER'S AGENDA
// ----------------------------------------

function displayAgenda(userId) {
  // Default to empty array [] if localStorage returns null for new users
  const data = getData(userId) || [];

  const upcomingItems = getUpcomingAgendaItems(
    data,
    new Date().toISOString().split("T")[0]
  );

  agenda.innerHTML = "";

  if (upcomingItems.length === 0) {
    emptyMessage.hidden = false;
    return;
  }

  emptyMessage.hidden = true;

  upcomingItems.forEach((item) => {
    const li = document.createElement("li");

    li.textContent =
      `${item.topic} — ${item.revisionDate}`;

    agenda.appendChild(li);
  });
}


// ----------------------------------------
// USER SELECTION
// ----------------------------------------

userSelect.addEventListener("change", () => {
  const userId = userSelect.value;

  displayAgenda(userId);
});


// ----------------------------------------
// ADD NEW TOPIC
// ----------------------------------------

topicForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const userId = userSelect.value;
  const topic = topicInput.value.trim();
  const learnedDate = learnedDateInput.value;

  if (!userId) {
    alert("Please select a user first.");
    return;
  }

  if (!topic || !learnedDate) {
    return;
  }

  const revisionDates =
    calculateRevisionDates(learnedDate);

  const newItems = revisionDates.map((revisionDate) => ({
    topic,
    revisionDate
  }));

  addData(userId, newItems);

  displayAgenda(userId);

  topicForm.reset();
  setDefaultDate();
});


// ----------------------------------------
// INITIAL PAGE SETUP
// ----------------------------------------

populateUsers();
setDefaultDate();
emptyMessage.hidden = false;

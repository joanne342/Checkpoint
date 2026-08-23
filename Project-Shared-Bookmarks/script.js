import { getUserIds, getData, setData } from "./storage.js";
import { sortBookmarks } from "./utils.js";

const userSelect = document.querySelector("#user-select");
const bookmarkList = document.querySelector("#bookmark-list");
const bookmarkForm = document.querySelector("#bookmark-form");

const urlInput = document.querySelector("#bookmark-url");
const titleInput = document.querySelector("#bookmark-title");
const descriptionInput = document.querySelector("#bookmark-description");

const userIds = getUserIds();

for (const userId of userIds) {
  const option = document.createElement("option");

  option.value = userId;
  option.textContent = `User ${userId}`;

  userSelect.appendChild(option);
}

function displayBookmarks(userId) {
  const bookmarks = getData(userId);

  bookmarkList.innerHTML = "";

  if (bookmarks.length === 0) {
    const message = document.createElement("li");
    message.textContent = "This user has no bookmarks yet.";
    bookmarkList.appendChild(message);
    return;
  }

  const sortedBookmarks = sortBookmarks(bookmarks);

  for (const bookmark of sortedBookmarks) {
    const item = document.createElement("li");

    const title = document.createElement("a");
    title.href = bookmark.url;
    title.textContent = bookmark.title;
    title.target = "_blank";

    const copyButton = document.createElement("button");
    copyButton.type = "button";
    copyButton.textContent = "Copy URL";

    copyButton.addEventListener("click", async () => {
      await navigator.clipboard.writeText(bookmark.url);
      copyButton.textContent = "URL copied!";
    });

    const description = document.createElement("p");
    description.textContent = bookmark.description;

    const timestamp = document.createElement("time");
    const date = new Date(bookmark.timestamp);

    timestamp.dateTime = date.toISOString();
    timestamp.textContent = `Created: ${date.toLocaleString("en-GB")}`;

    const likeButton = document.createElement("button");
    likeButton.type = "button";
    likeButton.textContent = `Like (${bookmark.likes || 0})`;

    likeButton.addEventListener("click", () => {
      bookmark.likes = (bookmark.likes || 0) + 1;

      setData(userId, bookmarks);

      likeButton.textContent = `Like (${bookmark.likes})`;
    });

    item.appendChild(title);
    item.appendChild(copyButton);
    item.appendChild(description);
    item.appendChild(timestamp);
    item.appendChild(likeButton);

    bookmarkList.appendChild(item);
  }
}

userSelect.addEventListener("change", () => {
  const selectedUserId = userSelect.value;

  if (selectedUserId === "") {
    bookmarkList.innerHTML = "";
    return;
  }

  displayBookmarks(selectedUserId);
});

bookmarkForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const selectedUserId = userSelect.value;

  if (selectedUserId === "") {
    alert("Please select a user first.");
    return;
  }

  const bookmarks = getData(selectedUserId);

  const newBookmark = {
    url: urlInput.value,
    title: titleInput.value,
    description: descriptionInput.value,
    timestamp: Date.now(),
    likes: 0
  };

  bookmarks.push(newBookmark);

  setData(selectedUserId, bookmarks);

  bookmarkForm.reset();

  displayBookmarks(selectedUserId);
});

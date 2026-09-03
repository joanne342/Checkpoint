```js
// Get the elements we need from the HTML
const form = document.querySelector("#leaderboard-form");
const usernameInput = document.querySelector("#usernames");
const rankingSelect = document.querySelector("#ranking");
const message = document.querySelector("#message");
const leaderboardBody = document.querySelector("#leaderboard-body");

// Keep the successfully fetched users in memory so that
// changing the ranking does not require another API request.
let users = [];

/**
 * Fetch one user's information from Codewars.
 */
export async function fetchUser(username) {
  const response = await fetch(
    `https://www.codewars.com/api/v1/users/${encodeURIComponent(username)}`
  );

  if (response.status === 404) {
    throw new Error(`User "${username}" was not found.`);
  }

  if (!response.ok) {
    throw new Error(`Could not fetch "${username}".`);
  }

  return response.json();
}

/**
 * Turn the comma-separated input into an array of usernames.
 */
export function parseUsernames(input) {
  return input
    .split(",")
    .map((username) => username.trim())
    .filter(Boolean);
}

/**
 * Find every language represented by the users.
 */
export function getAllLanguages(users) {
  const languages = new Set();

  for (const user of users) {
    const userLanguages = user.ranks?.languages ?? {};

    for (const language of Object.keys(userLanguages)) {
      languages.add(language);
    }
  }

  return [...languages].sort();
}

/**
 * Get the score for the selected ranking.
 */
export function getScore(user, selectedLanguage) {
  if (selectedLanguage === "overall") {
    return user.ranks?.overall?.score ?? 0;
  }

  return user.ranks?.languages?.[selectedLanguage]?.score ?? 0;
}

/**
 * Create the leaderboard data.
 *
 * Users who don't have the selected language are excluded.
 * Results are sorted from highest score to lowest score.
 */
export function getLeaderboard(users, selectedLanguage) {
  return users
    .filter((user) => {
      if (selectedLanguage === "overall") {
        return user.ranks?.overall;
      }

      return user.ranks?.languages?.[selectedLanguage];
    })
    .map((user) => ({
      username: user.username,
      clan: user.clan || "",
      score: getScore(user, selectedLanguage),
    }))
    .sort((a, b) => b.score - a.score);
}

/**
 * Put the available rankings into the dropdown.
 */
function populateRankingSelect(users) {
  rankingSelect.innerHTML = "";

  const overallOption = document.createElement("option");
  overallOption.value = "overall";
  overallOption.textContent = "Overall";
  rankingSelect.appendChild(overallOption);

  for (const language of getAllLanguages(users)) {
    const option = document.createElement("option");

    option.value = language;
    option.textContent = language;

    rankingSelect.appendChild(option);
  }

  rankingSelect.value = "overall";
}

/**
 * Display the leaderboard table.
 */
function renderLeaderboard(selectedLanguage = "overall") {
  const leaderboard = getLeaderboard(users, selectedLanguage);

  leaderboardBody.innerHTML = "";

  if (leaderboard.length === 0) {
    message.textContent =
      "No users have a ranking for the selected language.";
    return;
  }

  message.textContent = "";

  leaderboard.forEach((user, index) => {
    const row = document.createElement("tr");

    // Highlight the highest-scoring user.
    if (index === 0) {
      row.classList.add("winner");
    }

    const usernameCell = document.createElement("td");
    usernameCell.textContent = user.username;

    const clanCell = document.createElement("td");
    clanCell.textContent = user.clan;

    const scoreCell = document.createElement("td");
    scoreCell.textContent = user.score;

    row.appendChild(usernameCell);
    row.appendChild(clanCell);
    row.appendChild(scoreCell);

    leaderboardBody.appendChild(row);
  });
}

/**
 * Fetch all submitted users.
 *
 * Promise.allSettled allows valid users to remain in the
 * leaderboard even when one or more usernames are invalid.
 */
async function fetchUsers(usernames) {
  const results = await Promise.allSettled(
    usernames.map((username) => fetchUser(username))
  );

  const validUsers = [];
  const invalidUsers = [];

  results.forEach((result, index) => {
    if (result.status === "fulfilled") {
      validUsers.push(result.value);
    } else {
      invalidUsers.push(usernames[index]);
    }
  });

  return { validUsers, invalidUsers };
}

/**
 * Handle form submission.
 */
form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const usernames = parseUsernames(usernameInput.value);

  if (usernames.length === 0) {
    message.textContent = "Please enter at least one Codewars username.";
    return;
  }

  message.textContent = "Loading...";

  try {
    const result = await fetchUsers(usernames);

    users = result.validUsers;

    if (result.invalidUsers.length > 0) {
      message.textContent =
        `Could not find: ${result.invalidUsers.join(", ")}`;
    } else {
      message.textContent = "";
    }

    if (users.length === 0) {
      message.textContent = "No valid Codewars users were found.";
      leaderboardBody.innerHTML = "";
      rankingSelect.innerHTML = "";
      return;
    }

    populateRankingSelect(users);
    renderLeaderboard("overall");
  } catch (error) {
    message.textContent =
      "Unable to contact Codewars. Please try again later.";
  }
});

/**
 * Update the table when the selected ranking changes.
 */
rankingSelect.addEventListener("change", () => {
  renderLeaderboard(rankingSelect.value);
});
```

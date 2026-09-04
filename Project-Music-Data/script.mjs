import {
  getUserIDs,
  getListenEvents,
  getSong
} from "./data.mjs";

const userSelect = document.querySelector("#userSelect");
const results = document.querySelector("#results");

// Add users to the dropdown
getUserIDs().forEach(userID => {
  const option = document.createElement("option");

  option.value = userID;
  option.textContent = userID;

  userSelect.appendChild(option);
});

// When the user selects a user
userSelect.addEventListener("change", event => {
  const userID = event.target.value;

  renderResults(userID);
});


// --------------------
// General helper functions
// --------------------

function tallyMetrics(
  events,
  keyFunction,
  valueFunction = () => 1
) {
  const totals = {};

  events.forEach(event => {
    const key = keyFunction(event);
    const value = valueFunction(event);

    if (!totals[key]) {
      totals[key] = 0;
    }

    totals[key] += value;
  });

  return totals;
}


function getWinner(totals) {
  let winner = null;
  let highestValue = 0;

  for (const key in totals) {
    if (totals[key] > highestValue) {
      highestValue = totals[key];
      winner = key;
    }
  }

  return {
    key: winner,
    count: highestValue
  };
}


function getDateOnly(timestamp) {
  return new Date(timestamp).toISOString().slice(0, 10);
}


function getUniqueDates(events) {
  const dates = events.map(event => getDateOnly(event.timestamp));

  return [...new Set(dates)].sort();
}


// --------------------
// Questions 1–4
// --------------------

// Q1: Most listened-to song by number of listens
function getMostListenedSong(userID) {
  const events = getListenEvents(userID);

  if (events.length === 0) {
    return null;
  }

  const counts = tallyMetrics(
    events,
    event => event.song_id
  );

  return getWinner(counts);
}


// Q1: Most listened-to song by listening time
function getMostListenedSongByTime(userID) {
  const events = getListenEvents(userID);

  if (events.length === 0) {
    return null;
  }

  const totals = tallyMetrics(
    events,
    event => event.song_id,
    event => getSong(event.song_id).duration_seconds
  );

  return getWinner(totals);
}


// Q2: Most listened-to artist by number of listens
function getMostListenedArtist(userID) {
  const events = getListenEvents(userID);

  if (events.length === 0) {
    return null;
  }

  const counts = tallyMetrics(
    events,
    event => getSong(event.song_id).artist
  );

  return getWinner(counts);
}


// Q2: Most listened-to artist by listening time
function getMostListenedArtistByTime(userID) {
  const events = getListenEvents(userID);

  if (events.length === 0) {
    return null;
  }

  const totals = tallyMetrics(
    events,
    event => getSong(event.song_id).artist,
    event => getSong(event.song_id).duration_seconds
  );

  return getWinner(totals);
}


// --------------------
// Question 3: Friday night
// --------------------

function isFridayNight(timestamp) {
  const date = new Date(timestamp);

  const day = date.getDay();
  const hour = date.getHours();

  // Friday from 5pm onwards
  if (day === 5 && hour >= 17) {
    return true;
  }

  // Saturday before 4am
  if (day === 6 && hour < 4) {
    return true;
  }

  return false;
}


function getFridayNightEvents(userID) {
  const events = getListenEvents(userID);

  return events.filter(event =>
    isFridayNight(event.timestamp)
  );
}


// Q3: Most listened-to Friday-night song by number of listens
function getMostListenedFridayNightSong(userID) {
  const events = getFridayNightEvents(userID);

  if (events.length === 0) {
    return null;
  }

  const counts = tallyMetrics(
    events,
    event => event.song_id
  );

  return getWinner(counts);
}


// Q3: Most listened-to Friday-night song by listening time
function getMostListenedFridayNightSongByTime(userID) {
  const events = getFridayNightEvents(userID);

  if (events.length === 0) {
    return null;
  }

  const totals = tallyMetrics(
    events,
    event => event.song_id,
    event => getSong(event.song_id).duration_seconds
  );

  return getWinner(totals);
}


// --------------------
// Question 5: Longest streak
// --------------------

function getLongestStreakForSong(events) {
  const dates = events.map(event =>
    getDateOnly(event.timestamp)
  );

  const uniqueDates = [...new Set(dates)].sort();

  if (uniqueDates.length === 0) {
    return 0;
  }

  let longestStreak = 1;
  let currentStreak = 1;

  for (let i = 1; i < uniqueDates.length; i++) {
    const previousDate = new Date(uniqueDates[i - 1]);
    const currentDate = new Date(uniqueDates[i]);

    const difference =
      (currentDate - previousDate) /
      (1000 * 60 * 60 * 24);

    if (difference === 1) {
      currentStreak++;
    } else {
      currentStreak = 1;
    }

    if (currentStreak > longestStreak) {
      longestStreak = currentStreak;
    }
  }

  return longestStreak;
}


function getLongestStreak(userID) {
  const events = getListenEvents(userID);

  if (events.length === 0) {
    return null;
  }

  const eventsBySong = {};

  events.forEach(event => {
    if (!eventsBySong[event.song_id]) {
      eventsBySong[event.song_id] = [];
    }

    eventsBySong[event.song_id].push(event);
  });

  let bestSong = null;
  let bestStreak = 0;

  for (const songID in eventsBySong) {
    const streak = getLongestStreakForSong(
      eventsBySong[songID]
    );

    if (streak > bestStreak) {
      bestStreak = streak;
      bestSong = songID;
    }
  }

  return {
    songID: bestSong,
    streak: bestStreak
  };
}


// --------------------
// Question 6: Everyday songs
// --------------------

function getEverydaySongs(userID) {
  const events = getListenEvents(userID);

  if (events.length === 0) {
    return [];
  }

  const allDates = getUniqueDates(events);
  const totalDays = allDates.length;

  const datesBySong = {};

  events.forEach(event => {
    const songID = event.song_id;
    const date = getDateOnly(event.timestamp);

    if (!datesBySong[songID]) {
      datesBySong[songID] = new Set();
    }

    datesBySong[songID].add(date);
  });

  const everydaySongIDs = [];

  for (const songID in datesBySong) {
    if (datesBySong[songID].size === totalDays) {
      everydaySongIDs.push(songID);
    }
  }

  return everydaySongIDs;
}


// --------------------
// Question 7: Top genres
// --------------------

function getTopGenres(userID) {
  const events = getListenEvents(userID);

  if (events.length === 0) {
    return [];
  }

  const counts = tallyMetrics(
    events,
    event => getSong(event.song_id).genre
  );

  return Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3);
}


// --------------------
// Formatting functions
// --------------------

function formatDuration(seconds) {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;

  return `${minutes}m ${remainingSeconds}s`;
}


function formatSongResult(result) {
  if (!result) {
    return null;
  }

  const song = getSong(result.key);

  return `${song.title} — ${song.artist} (${result.count} listens)`;
}


function formatSongTimeResult(result) {
  if (!result) {
    return null;
  }

  const song = getSong(result.key);

  return `${song.title} — ${song.artist} (${formatDuration(result.count)})`;
}


function formatArtistResult(result) {
  if (!result) {
    return null;
  }

  return `${result.key} (${result.count} listens)`;
}


function formatArtistTimeResult(result) {
  if (!result) {
    return null;
  }

  return `${result.key} (${formatDuration(result.count)})`;
}


function formatLongestStreak(result) {
  if (!result) {
    return null;
  }

  const song = getSong(result.songID);

  return `${song.title} — ${song.artist} (${result.streak} days)`;
}


function formatEverydaySongs(songIDs) {
  if (songIDs.length === 0) {
    return null;
  }

  return songIDs
    .map(songID => {
      const song = getSong(songID);

      return `${song.title} — ${song.artist}`;
    })
    .join(", ");
}


function formatTopGenres(genres) {
  if (genres.length === 0) {
    return null;
  }

  return genres
    .map(genre => genre[0])
    .join(", ");
}


// --------------------
// Rendering
// --------------------

function renderQuestion(title, answer) {
  if (!answer) {
    return;
  }

  const heading = document.createElement("h2");
  heading.textContent = title;

  const paragraph = document.createElement("p");
  paragraph.textContent = answer;

  results.appendChild(heading);
  results.appendChild(paragraph);
}


function renderResults(userID) {
  const events = getListenEvents(userID);

  results.innerHTML = "";

  // User has no listening data
  if (events.length === 0) {
    results.textContent =
      "This user didn't listen to any songs.";

    return;
  }


  // Q1 — Most listened-to song
  const mostListenedSong =
    getMostListenedSong(userID);

  renderQuestion(
    "Most listened-to song",
    formatSongResult(mostListenedSong)
  );


  // Q1 — Most listened-to song by time
  const songByTime =
    getMostListenedSongByTime(userID);

  renderQuestion(
    "Most listened-to song by listening time",
    formatSongTimeResult(songByTime)
  );


  // Q2 — Most listened-to artist
  const mostListenedArtist =
    getMostListenedArtist(userID);

  renderQuestion(
    "Most listened-to artist",
    formatArtistResult(mostListenedArtist)
  );


  // Q2 — Most listened-to artist by time
  const artistByTime =
    getMostListenedArtistByTime(userID);

  renderQuestion(
    "Most listened-to artist by listening time",
    formatArtistTimeResult(artistByTime)
  );


  // Q3 — Most listened-to Friday-night song
  const fridayNightSong =
    getMostListenedFridayNightSong(userID);

  renderQuestion(
    "Most listened-to song on Friday night",
    formatSongResult(fridayNightSong)
  );


  // Q3 — Friday-night song by time
  const fridaySongByTime =
    getMostListenedFridayNightSongByTime(userID);

  renderQuestion(
    "Most listened-to Friday-night song by listening time",
    formatSongTimeResult(fridaySongByTime)
  );


  // Q5 — Longest listening streak
  const longestStreak =
    getLongestStreak(userID);

  renderQuestion(
    "Longest listening streak",
    formatLongestStreak(longestStreak)
  );


  // Q6 — Songs listened to every day
  const everydaySongs =
    getEverydaySongs(userID);

  renderQuestion(
    "Songs listened to every day",
    formatEverydaySongs(everydaySongs)
  );


  // Q7 — Top genres
  const topGenres =
    getTopGenres(userID);

  const genreTitle =
    topGenres.length === 1
      ? "Top genre"
      : `Top ${topGenres.length} genres`;

  renderQuestion(
    genreTitle,
    formatTopGenres(topGenres)
  );
}

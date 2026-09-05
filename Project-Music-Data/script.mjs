import {
  getUserIDs,
  getListenEvents,
  getSong
} from "./data.mjs";

const userSelect =
  typeof document !== "undefined"
    ? document.querySelector("#userSelect")
    : null;

const results =
  typeof document !== "undefined"
    ? document.querySelector("#results")
    : null;

// Populate the user dropdown
if (userSelect) {
  getUserIDs().forEach(userID => {
    const option = document.createElement("option");
    option.value = userID;
    option.textContent = userID;
    userSelect.appendChild(option);
  });

  userSelect.addEventListener("change", event => {
    const userID = event.target.value;
    renderResults(userID);
  });
}


// --------------------
// Shared calculations
// --------------------

function tallyMetrics(events, keyFunction, valueFunction = () => 1) {
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


// --------------------
// Q1 - Most listened-to song
// --------------------

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


// --------------------
// Q2 - Most listened-to artist
// --------------------

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
// Q3 - Friday night
// --------------------

function isFridayNight(timestamp) {
  const date = new Date(timestamp);
  const day = date.getDay();
  const hour = date.getHours();

  // Friday 17:00 or later
  if (day === 5 && hour >= 17) {
    return true;
  }

  // Saturday before 04:00
  if (day === 6 && hour < 4) {
    return true;
  }

  return false;
}


function getFridayNightEvents(userID) {
  const events = getListenEvents(userID);

  return events.filter(
    event => isFridayNight(event.timestamp)
  );
}


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
// Q5 - Longest listening streak
// --------------------

function getLongestStreak(userID) {
  const events = getListenEvents(userID);

  if (events.length === 0) {
    return null;
  }

  let bestSong = events[0].song_id;
  let bestStreak = 1;

  let currentSong = events[0].song_id;
  let currentStreak = 1;

  for (let i = 1; i < events.length; i++) {
    if (events[i].song_id === currentSong) {
      currentStreak++;
    } else {
      currentSong = events[i].song_id;
      currentStreak = 1;
    }

    if (currentStreak > bestStreak) {
      bestStreak = currentStreak;
      bestSong = currentSong;
    }
  }

  return {
    songID: bestSong,
    streak: bestStreak
  };
}


// --------------------
// Q6 - Songs listened to every day
// --------------------

function getDateOnly(timestamp) {
  return timestamp.slice(0, 10);
}


function getUniqueDates(events) {
  const dates = events.map(
    event => getDateOnly(event.timestamp)
  );

  return [...new Set(dates)].sort();
}


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
// Q7 - Top genres
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
// Formatting
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

  return `${song.title} — ${song.artist} (${result.streak} consecutive listens)`;
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

  // User with no listening data
  if (events.length === 0) {
    results.textContent = "This user didn't listen to any songs.";
    return;
  }

  // Q1
  const mostListenedSong = getMostListenedSong(userID);

  renderQuestion(
    "Most listened-to song",
    formatSongResult(mostListenedSong)
  );

  const songByTime = getMostListenedSongByTime(userID);

  renderQuestion(
    "Most listened-to song by listening time",
    formatSongTimeResult(songByTime)
  );

  // Q2
  const mostListenedArtist = getMostListenedArtist(userID);

  renderQuestion(
    "Most listened-to artist",
    formatArtistResult(mostListenedArtist)
  );

  const artistByTime = getMostListenedArtistByTime(userID);

  renderQuestion(
    "Most listened-to artist by listening time",
    formatArtistTimeResult(artistByTime)
  );

  // Q3
  const fridayNightSong =
    getMostListenedFridayNightSong(userID);

  renderQuestion(
    "Most listened-to song on Friday night",
    formatSongResult(fridayNightSong)
  );

  const fridaySongByTime =
    getMostListenedFridayNightSongByTime(userID);

  renderQuestion(
    "Most listened-to Friday-night song by listening time",
    formatSongTimeResult(fridaySongByTime)
  );

  // Q5
  const longestStreak = getLongestStreak(userID);

  renderQuestion(
    "Longest listening streak",
    formatLongestStreak(longestStreak)
  );

  // Q6
  const everydaySongs = getEverydaySongs(userID);

  renderQuestion(
    "Songs listened to every day",
    formatEverydaySongs(everydaySongs)
  );

  // Q7
  const topGenres = getTopGenres(userID);

  const genreTitle =
    topGenres.length === 1
      ? "Top genre"
      : `Top ${topGenres.length} genres`;

  renderQuestion(
    genreTitle,
    formatTopGenres(topGenres)
  );
}


// --------------------
// Exports for testing
// --------------------

export {
  tallyMetrics,
  getWinner,
  getMostListenedSong,
  getMostListenedSongByTime,
  getMostListenedArtist,
  getMostListenedArtistByTime,
  getMostListenedFridayNightSong,
  getMostListenedFridayNightSongByTime,
  getLongestStreak,
  getEverydaySongs,
  getTopGenres
};

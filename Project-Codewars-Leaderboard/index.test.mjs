import test from "node:test";
import assert from "node:assert";
import nock from "nock";

import {
  fetchUser,
  parseUsernames,
  getAllLanguages,
  getScore,
  getLeaderboard,
} from "./index.mjs";

const codewarsApi = "https://www.codewars.com";

/*
 * ---------------------------------------------------------
 * 1. Parse comma-separated usernames
 * ---------------------------------------------------------
 */

test("parseUsernames removes spaces and empty entries", () => {
  const result = parseUsernames(
    " alice, bob , , charlie "
  );

  assert.deepStrictEqual(result, [
    "alice",
    "bob",
    "charlie",
  ]);
});


/*
 * ---------------------------------------------------------
 * 2. Fetch a Codewars user
 * ---------------------------------------------------------
 */

test("fetchUser returns a user's Codewars data", async () => {
  const user = {
    username: "alice",
    clan: "CodeYourFuture",
    ranks: {
      overall: {
        score: 500,
        rank: 5,
      },
      languages: {
        JavaScript: {
          score: 300,
          rank: 10,
        },
      },
    },
  };

  const scope = nock(codewarsApi)
    .get("/api/v1/users/alice")
    .reply(200, user);

  const result = await fetchUser("alice");

  assert.deepStrictEqual(result, user);
  assert.strictEqual(scope.isDone(), true);
});


/*
 * ---------------------------------------------------------
 * 3. Invalid username
 * ---------------------------------------------------------
 */

test("fetchUser reports a 404 for an invalid username", async () => {
  const scope = nock(codewarsApi)
    .get("/api/v1/users/not-a-real-user")
    .reply(404);

  await assert.rejects(
    () => fetchUser("not-a-real-user"),
    /not found/i
  );

  assert.strictEqual(scope.isDone(), true);
});


/*
 * ---------------------------------------------------------
 * 4. Dynamically find all languages
 * ---------------------------------------------------------
 */

test("getAllLanguages finds languages across all users", () => {
  const users = [
    {
      ranks: {
        languages: {
          JavaScript: { score: 100 },
          Python: { score: 200 },
        },
      },
    },
    {
      ranks: {
        languages: {
          Python: { score: 300 },
          Ruby: { score: 400 },
        },
      },
    },
  ];

  const result = getAllLanguages(users);

  assert.deepStrictEqual(result, [
    "JavaScript",
    "Python",
    "Ruby",
  ]);
});


/*
 * ---------------------------------------------------------
 * 5. Get overall score
 * ---------------------------------------------------------
 */

test("getScore returns the overall score", () => {
  const user = {
    ranks: {
      overall: {
        score: 750,
      },
    },
  };

  assert.strictEqual(
    getScore(user, "overall"),
    750
  );
});


/*
 * ---------------------------------------------------------
 * 6. Get language score
 * ---------------------------------------------------------
 */

test("getScore returns the selected language score", () => {
  const user = {
    ranks: {
      overall: {
        score: 750,
      },
      languages: {
        JavaScript: {
          score: 450,
        },
      },
    },
  };

  assert.strictEqual(
    getScore(user, "JavaScript"),
    450
  );
});


/*
 * ---------------------------------------------------------
 * 7. Filter and sort the leaderboard
 * ---------------------------------------------------------
 */

test("getLeaderboard excludes users without the selected language and sorts by score", () => {
  const users = [
    {
      username: "alice",
      clan: "CYF",
      ranks: {
        overall: { score: 500 },
        languages: {
          JavaScript: { score: 200 },
        },
      },
    },
    {
      username: "bob",
      clan: "CYF",
      ranks: {
        overall: { score: 800 },
        languages: {
          JavaScript: { score: 600 },
        },
      },
    },
    {
      username: "charlie",
      clan: "CYF",
      ranks: {
        overall: { score: 700 },
        languages: {
          Python: { score: 900 },
        },
      },
    },
  ];

  const result = getLeaderboard(users, "JavaScript");

  assert.deepStrictEqual(result, [
    {
      username: "bob",
      clan: "CYF",
      score: 600,
    },
    {
      username: "alice",
      clan: "CYF",
      score: 200,
    },
  ]);
});


/*
 * ---------------------------------------------------------
 * 8. Overall leaderboard sorting
 * ---------------------------------------------------------
 */

test("getLeaderboard sorts the overall ranking highest first", () => {
  const users = [
    {
      username: "alice",
      clan: "CYF",
      ranks: {
        overall: { score: 100 },
        languages: {},
      },
    },
    {
      username: "bob",
      clan: "CYF",
      ranks: {
        overall: { score: 500 },
        languages: {},
      },
    },
    {
      username: "charlie",
      clan: "CYF",
      ranks: {
        overall: { score: 300 },
        languages: {},
      },
    },
  ];

  const result = getLeaderboard(users, "overall");

  assert.deepStrictEqual(
    result.map((user) => user.username),
    [
      "bob",
      "charlie",
      "alice",
    ]
  );
});


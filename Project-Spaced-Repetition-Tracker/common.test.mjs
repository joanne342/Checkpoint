import assert from "node:assert";
import { test } from "node:test";

import {
  getUserIds,
  calculateRevisionDates,
  getUpcomingAgendaItems,
} from "./common.mjs";


test("There are exactly 5 users", () => {
  assert.deepEqual(
    getUserIds(),
    ["1", "2", "3", "4", "5"]
  );
});


test("A topic has exactly 5 revision dates", () => {
  const dates = calculateRevisionDates("2026-07-19");

  assert.equal(dates.length, 5);
});


test("Revision dates are calculated correctly", () => {
  const dates = calculateRevisionDates("2026-07-19");

  assert.deepEqual(dates, [
    "2026-07-26",
    "2026-08-19",
    "2026-10-19",
    "2027-01-19",
    "2027-07-19",
  ]);
});


test("Past agenda items are removed", () => {
  const agenda = [
    { topic: "Old topic", revisionDate: "2026-07-01" },
    { topic: "Current topic", revisionDate: "2026-09-04" },
    { topic: "Future topic", revisionDate: "2026-10-01" },
  ];

  const result = getUpcomingAgendaItems(
    agenda,
    "2026-09-04"
  );

  assert.deepEqual(result, [
    { topic: "Current topic", revisionDate: "2026-09-04" },
    { topic: "Future topic", revisionDate: "2026-10-01" },
  ]);
});


test("Upcoming agenda items are sorted chronologically", () => {
  const agenda = [
    { topic: "October", revisionDate: "2026-10-01" },
    { topic: "September", revisionDate: "2026-09-10" },
    { topic: "December", revisionDate: "2026-12-01" },
  ];

  const result = getUpcomingAgendaItems(
    agenda,
    "2026-09-04"
  );

  assert.deepEqual(result, [
    { topic: "September", revisionDate: "2026-09-10" },
    { topic: "October", revisionDate: "2026-10-01" },
    { topic: "December", revisionDate: "2026-12-01" },
  ]);
});


test("Returns an empty array when all agenda items are in the past", () => {
  const agenda = [
    { topic: "Topic 1", revisionDate: "2026-08-01" },
    { topic: "Topic 2", revisionDate: "2026-08-15" },
  ];

  const result = getUpcomingAgendaItems(
    agenda,
    "2026-09-04"
  );

  assert.deepEqual(result, []);
});

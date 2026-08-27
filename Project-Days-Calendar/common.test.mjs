import assert from "node:assert/strict";
import { test } from "node:test";

function getDateForOccurrence(year, month, weekday, occurrence) {
    const dates = [];

    const daysInMonth = new Date(year, month + 1, 0).getDate();

    for (let day = 1; day <= daysInMonth; day++) {
        const date = new Date(year, month, day);

        if (date.getDay() === weekday) {
            dates.push(day);
        }
    }

    if (occurrence === "last") {
        return dates[dates.length - 1];
    }

    const occurrenceNumbers = {
        first: 1,
        second: 2,
        third: 3,
        fourth: 4,
        fifth: 5
    };

    return dates[occurrenceNumbers[occurrence] - 1];
}

test("finds the second Tuesday in October 2024", () => {
    const date = getDateForOccurrence(
        2024,
        9,
        2,
        "second"
    );

    assert.equal(date, 8);
});

test("finds the last Friday in October 2024", () => {
    const date = getDateForOccurrence(
        2024,
        9,
        5,
        "last"
    );

    assert.equal(date, 25);
});

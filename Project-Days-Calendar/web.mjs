// This is a placeholder file which shows how you can access functions and data defined in other files.
// It can be loaded into index.html.
// Note that when running locally, in order to open a web page which uses modules, you must serve the directory over HTTP.
// You can't open the index.html file using a file:// URL.

const today = new Date();

const currentMonth = today.toLocaleString("en-GB", {
    month: "long"
});

const currentYear = today.getFullYear();

const monthDisplay = document.querySelector("#current-month");

monthDisplay.textContent = `${currentMonth} ${currentYear}`;

const calendar = document.querySelector("#calendar");

const daysInMonth = new Date(
    currentYear,
    today.getMonth() + 1,
    0
).getDate();

const firstDay = new Date(
    currentYear,
    today.getMonth(),
    1
);

const firstDayOfWeek = firstDay.getDay();

for (let i = 0; i < firstDayOfWeek; i++) {
    const emptyBox = document.createElement("div");
    emptyBox.setAttribute("aria-hidden", "true");
    calendar.appendChild(emptyBox);
}

for (let day = 1; day <= daysInMonth; day++) {
    const dayBox = document.createElement("div");
    dayBox.textContent = day;
    calendar.appendChild(dayBox);
}

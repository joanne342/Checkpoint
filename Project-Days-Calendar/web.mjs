const today = new Date();

let displayedMonth = today.getMonth();
let displayedYear = today.getFullYear();

const monthSelect = document.querySelector("#month-select");
const yearSelect = document.querySelector("#year-select");
const monthDisplay = document.querySelector("#current-month");
const calendar = document.querySelector("#calendar");
const previousButton = document.querySelector("#previous-month");
const nextButton = document.querySelector("#next-month");

const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December"
];

const weekdays = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday"
];

let commemorativeDays = [];

async function loadDays() {
    const response = await fetch("days.json");
    commemorativeDays = await response.json();

    renderCalendar();
}

function populateMonthSelect() {
    months.forEach((month, index) => {
        const option = document.createElement("option");

        option.value = index;
        option.textContent = month;

        monthSelect.appendChild(option);
    });
}

function populateYearSelect() {
    for (
        let year = today.getFullYear() - 10;
        year <= today.getFullYear() + 10;
        year++
    ) {
        const option = document.createElement("option");

        option.value = year;
        option.textContent = year;

        yearSelect.appendChild(option);
    }
}

function getCommemorativeDayDate(day, year) {
    const month = months.indexOf(day.monthName);
    const weekday = weekdays.indexOf(day.dayName);

    const daysInMonth = new Date(
        year,
        month + 1,
        0
    ).getDate();

    const matchingDays = [];

    for (let date = 1; date <= daysInMonth; date++) {
        const currentDate = new Date(year, month, date);

        if (currentDate.getDay() === weekday) {
            matchingDays.push(date);
        }
    }

    if (day.occurrence === "last") {
        return matchingDays[matchingDays.length - 1];
    }

    const occurrenceNumbers = {
        first: 1,
        second: 2,
        third: 3,
        fourth: 4,
        fifth: 5
    };

    const occurrenceNumber = occurrenceNumbers[day.occurrence];

    return matchingDays[occurrenceNumber - 1];
}

function getDaysForDate(year, month, date) {
    return commemorativeDays.filter((day) => {
        const dayMonth = months.indexOf(day.monthName);

        if (dayMonth !== month) {
            return false;
        }

        const commemorativeDate = getCommemorativeDayDate(day, year);

        return commemorativeDate === date;
    });
}

function renderCalendar() {
    calendar.innerHTML = "";

    monthDisplay.textContent =
        `${months[displayedMonth]} ${displayedYear}`;

    monthSelect.value = displayedMonth;
    yearSelect.value = displayedYear;

    weekdays.forEach((weekday) => {
        const heading = document.createElement("div");

        heading.textContent = weekday;
        heading.classList.add("calendar-day-name");

        calendar.appendChild(heading);
    });

    const firstDay = new Date(
        displayedYear,
        displayedMonth,
        1
    );

    const daysInMonth = new Date(
        displayedYear,
        displayedMonth + 1,
        0
    ).getDate();

    const firstDayOfWeek = firstDay.getDay();

    for (let i = 0; i < firstDayOfWeek; i++) {
        const emptyBox = document.createElement("div");

        emptyBox.classList.add("empty");
        emptyBox.setAttribute("aria-hidden", "true");

        calendar.appendChild(emptyBox);
    }

    for (let day = 1; day <= daysInMonth; day++) {
        const dayBox = document.createElement("div");

        dayBox.classList.add("calendar-day");

        const dayNumber = document.createElement("div");
        dayNumber.textContent = day;

        dayBox.appendChild(dayNumber);

        if (
            day === today.getDate() &&
            displayedMonth === today.getMonth() &&
            displayedYear === today.getFullYear()
        ) {
            dayBox.classList.add("today");
        }

        const daysOnThisDate = getDaysForDate(
            displayedYear,
            displayedMonth,
            day
        );

        daysOnThisDate.forEach((commemorativeDay) => {
            const event = document.createElement("div");

            event.textContent = commemorativeDay.name;
            event.classList.add("commemorative-day");

            dayBox.appendChild(event);
        });

        calendar.appendChild(dayBox);
    }
}

previousButton.addEventListener("click", () => {
    displayedMonth--;

    if (displayedMonth < 0) {
        displayedMonth = 11;
        displayedYear--;
    }

    renderCalendar();
});

nextButton.addEventListener("click", () => {
    displayedMonth++;

    if (displayedMonth > 11) {
        displayedMonth = 0;
        displayedYear++;
    }

    renderCalendar();
});

monthSelect.addEventListener("change", () => {
    displayedMonth = Number(monthSelect.value);

    renderCalendar();
});

yearSelect.addEventListener("change", () => {
    displayedYear = Number(yearSelect.value);

    renderCalendar();
});

populateMonthSelect();
populateYearSelect();

loadDays();

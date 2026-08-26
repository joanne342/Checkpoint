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
    "Sun",
    "Mon",
    "Tue",
    "Wed",
    "Thu",
    "Fri",
    "Sat"
];

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

function renderCalendar() {
    calendar.innerHTML = "";

    monthDisplay.textContent = `${months[displayedMonth]} ${displayedYear}`;

    monthSelect.value = displayedMonth;
    yearSelect.value = displayedYear;

    // Add weekday headings
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

    // Add empty spaces before the first day
    for (let i = 0; i < firstDayOfWeek; i++) {
        const emptyBox = document.createElement("div");

        emptyBox.classList.add("empty");
        emptyBox.setAttribute("aria-hidden", "true");

        calendar.appendChild(emptyBox);
    }

    // Add the days
    for (let day = 1; day <= daysInMonth; day++) {
        const dayBox = document.createElement("div");

        dayBox.textContent = day;

        // Highlight today
        if (
            day === today.getDate() &&
            displayedMonth === today.getMonth() &&
            displayedYear === today.getFullYear()
        ) {
            dayBox.classList.add("today");
            dayBox.setAttribute("aria-label", `Today, ${day}`);
        }

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
renderCalendar();

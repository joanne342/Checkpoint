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

function populateMonthSelect() {
    months.forEach((month, index) => {
        const option = document.createElement("option");

        option.value = index;
        option.textContent = month;

        monthSelect.appendChild(option);
    });
}

function populateYearSelect() {
    for (let year = today.getFullYear() - 10; year <= today.getFullYear() + 10; year++) {
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

        emptyBox.setAttribute("aria-hidden", "true");

        calendar.appendChild(emptyBox);
    }

    for (let day = 1; day <= daysInMonth; day++) {
        const dayBox = document.createElement("div");

        dayBox.textContent = day;

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

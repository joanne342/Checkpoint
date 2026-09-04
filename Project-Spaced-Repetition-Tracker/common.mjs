export function getUserIds() {
  return ["1", "2", "3", "4", "5"];
}

export function calculateRevisionDates(inputDate) {
  const date = new Date(inputDate);

  const revisionDates = [];

  const oneWeek = new Date(date);
  oneWeek.setDate(oneWeek.getDate() + 7);
  revisionDates.push(oneWeek);

  const oneMonth = new Date(date);
  oneMonth.setMonth(oneMonth.getMonth() + 1);
  revisionDates.push(oneMonth);

  const threeMonths = new Date(date);
  threeMonths.setMonth(threeMonths.getMonth() + 3);
  revisionDates.push(threeMonths);

  const sixMonths = new Date(date);
  sixMonths.setMonth(sixMonths.getMonth() + 6);
  revisionDates.push(sixMonths);

  const oneYear = new Date(date);
  oneYear.setFullYear(oneYear.getFullYear() + 1);
  revisionDates.push(oneYear);

  return revisionDates.map(date =>
    date.toISOString().split("T")[0]
  );
}

export function getUpcomingAgendaItems(agendaItems, currentDate) {
  const today = new Date(currentDate);

  return agendaItems
    .filter(item => new Date(item.revisionDate) >= today)
    .sort(
      (a, b) =>
        new Date(a.revisionDate) - new Date(b.revisionDate)
    );
}

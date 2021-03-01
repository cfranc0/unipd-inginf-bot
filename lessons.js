const lessonPlan = require("./lessonPlan.json");

// Todays classes but not the ones that are already over
function now() {

  // Fixing datetime using timezone
  let nz_date_string = new Date().toLocaleString("it-IT", { timeZone: "Europe/Rome" });
  let d = new Date(nz_date_string);

  // Today there might be no classes!
  if (lessonPlan.lesson_plan[d.getDay()].length == 0)
    return [];

  // Today's classes
  todayAgenda = lessonPlan.lesson_plan[d.getDay()].map(i => {return {
    from: i[1],
    to: i[2],
    courseid: i[0],
    course: lessonPlan.lessons[i[0]]
  }})

  let currentTime = parseInt("".concat(d.getHours(), (d.getMinutes() < 10 ? "0" : ""), d.getMinutes()))

  for (var i in todayAgenda) {
    if (todayAgenda[i].to < currentTime)
      delete todayAgenda[i];
  }

  return todayAgenda;

}

// Next class coming up
function next() {

  // Fixing datetime using timezone
  let nz_date_string = new Date().toLocaleString("it-IT", { timeZone: "Europe/Rome" });
  let d = new Date(nz_date_string);

  // Looking in the next 5 days
  for (var i = 0; i < 5; i++) {

    // Increase day
    d.setDate(d.getDate() + 1);

    if (lessonPlan.lesson_plan[d.getDay()].length == 0)
      continue;

    return {
      deltaDays: i+1,
      from: lessonPlan.lesson_plan[d.getDay()][0][1],
      to: lessonPlan.lesson_plan[d.getDay()][0][2],
      course: lessonPlan.lessons[lessonPlan.lesson_plan[d.getDay()][0][0]]
    };

  }

  // Nothing was found
  return {};

}

// [RAW] All classes
function all() {

  return lessonPlan.lessons;

}
// [RAW] Complete calendar
function calendar() {

  return lessonPlan.lesson_plan;

}

// One class based on id
function one(id) {

  return lessonPlan.lessons[id]

}

module.exports = [now, next, all, one, calendar];

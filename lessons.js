const lessonPlan = require("./lessonPlan.json");

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
    if (todayAgenda[i].from < currentTime)
      delete todayAgenda[i];
  }

  return todayAgenda;

}

function all() {

  return lessonPlan.lessons;

}

function one(id) {

  return lessonPlan.lessons[id]

}

module.exports = [now, all, one];

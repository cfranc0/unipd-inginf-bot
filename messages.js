/**
 * Compile the body of the message and possibily the inline keyboard for a specified
 * payload.
 */

const { Keyboard, Key } = require('telegram-keyboard');
const [lessonsNow, lessonsAll, lessonsOne] = require("./lessons");

/**
 * data structure
 * type: hello|tellme|courses|course
 *
 */
function compileMessage(data) {

  console.log("compileMessage : "+data.type);

  // Hello message
  if (data.type == "hello") {
    let keyboard = Keyboard.make([
      Key.callback('🤡 Che succede', 'tellme'),
      Key.callback('📚 Corsi', 'courses'),
    ])

    return {
      message: `👋 Ciao!\nQuesto bot ti dice i corsi e le lezioni per il secondo anno di ingegneria informatica a UniPD.\nScegli un opzione dal menù qui sotto.`,
      inlineKeyboard: keyboard.inline().reply_markup
    }

  }
  // Information about the current class, possibily the next
  else if (data.type == "tellme") {
    let ls = lessonsNow();

    // Creating the keyboard with the upcoming classes
    let keyboard = Keyboard.make([
      ...Object.keys(ls).map(i => {return [Key.callback(ls[i].course.emoji + " "+ls[i].course.name, "course."+ls[i].courseid+"[tellme]")]}),
      [Key.callback('◀️ Indietro', 'hello')],
    ])

    let message = `*🤡 Che succede*\n\n`;
    // If there are no other classes today...
    if (ls.reduce((c, a) => {c+=(a!=null)}, 0) == 0)
      message += `Per oggi non ci sono altre lezioni.`
    else {
      // Creating the message
      for (var i in ls) {

        message += `*${ls[i].course.emoji} ${ls[i].course.name}*\n🕐 ${Math.floor(ls[i].from/100)}:${ls[i].from - Math.floor(ls[i].from/100) * 100} → ${Math.floor(ls[i].to/100)}:${ls[i].to - Math.floor(ls[i].to/100) * 100}\n💻 `;

        // Adding the zoom link if available
        message += (ls[i].course.zoom != null ? `[Link Zoom](${ls[i].course.zoom})` : "_Nessun link Zoom_")

        message += "\n\n";
      }
    }


    return {
      message,
      inlineKeyboard: keyboard.inline().reply_markup
    }
  }
  // Information about all the courses in this semester
  else if (data.type == "courses") {
    let ls = lessonsAll();

    let courseKeyboard = Object.keys(ls).map(k => {return [Key.callback(ls[k].emoji + " "+ls[k].name, "course."+k+"[courses]")]});

    let keyboard = Keyboard.make([...courseKeyboard,[Key.callback('◀️ Indietro', 'hello')] ])

    return {
      message: `*📚 Corsi*\nQuesto semestre c'è:`,
      inlineKeyboard: keyboard.inline().reply_markup
    }
  }
  // More detailed information about one specific course
  else if (/^course\.([a-z0-9]+)(\[[a-z]+\])?$/.test(data.type)) {

    let thisCourse = lessonsOne(data.type.match(/^course\.([a-z0-9]+)(\[[a-z]+\])?$/)[1]);

    // Backlink is not to the home if the callback data is course.<ID>[<Go back to page>]
    let keyboard = Keyboard.make([Key.callback('◀️ Indietro', (data.type.match(/^course\.([a-z0-9]+)(\[[a-z]+\])?$/)[2] != undefined ? data.type.match(/^course\.([a-z0-9]+)(\[([a-z]+)\])?$/)[3] : "hello"))])

    // Class not found
    if (thisCourse == undefined) {
      return {
        message: `*📖 Corso*\n_Corso non trovato..._`,
        inlineKeyboard: keyboard.inline().reply_markup
      }
    }

    let message = `*${thisCourse.emoji} ${thisCourse.name}*\n_${thisCourse.prof}_\n\n`;

    if (thisCourse.moodle != null)
      message += `🌐 [Moodle](${thisCourse.moodle})\n`;
    if (thisCourse.email != null)
      message += `📧 [${thisCourse.email}](mailto:${thisCourse.email})\n`;
    if (thisCourse.moodle != null || thisCourse.email != null)
      message += `\n`;

    if (thisCourse.zoom != null)
      message += `💻 [Link Zoom](${thisCourse.zoom})`;
    if (thisCourse.note != null)
      message += `🗒 _${thisCourse.note}_`;

    return {
      message,
      inlineKeyboard: keyboard.inline().reply_markup
    }

  }

}

module.exports = compileMessage;

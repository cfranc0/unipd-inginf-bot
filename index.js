const Telebot = require('telebot');
require('dotenv').config();

const bot = new Telebot({
  token: process.env.TELEGRAM_TOKEN,
  polling: { // Optional. Use polling.
    interval: 1000, // Optional. How often check updates (in ms).
    timeout: 0, // Optional. Update polling timeout (0 - short polling).
    limit: 100, // Optional. Limits the number of updates to be retrieved.
    retryTimeout: 5000, // Optional. Reconnecting timeout (in ms).
  },
  webhook: (process.env.PORT != null ? { // When running in localhost, webhooks are disabled
    port: process.env.PORT || 8443,
    host: process.env.HOST,
    url: process.env.URL
  } : null)
})

//
compileMessage = require("./messages");

bot.on("/start", (msg, props) => {

  let m = compileMessage({type: "hello"})

  return bot.sendMessage(msg.chat.id, m.message, {replyMarkup: m.inlineKeyboard, notification: false});
});

bot.on("callbackQuery", (msg, props) => {

  // Multiple message types but it deletes the original message
  if (msg.data == "hello" || msg.data == "tellme" || msg.data == "courses" || /^course\.([a-z0-9]+)(\[[a-z]+\])?$/.test(msg.data)) {
    let m = compileMessage({type: msg.data});

    bot.deleteMessage(msg.message.chat.id, msg.message.message_id).catch(e => console.error(e));
    return bot.sendMessage(msg.message.chat.id, m.message, {replyMarkup: m.inlineKeyboard, parseMode: "Markdown", webPreview: false, notification: false})
  }
})


bot.start();

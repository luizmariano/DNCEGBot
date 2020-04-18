const storage = require('./lib/storage');
const getCharacter = require('./getCharacter');

module.exports = async (bot, msg, link) => {
  const data = await getCharacter(bot, msg, msg.from.id, link);
  if (!data) return;

  storage.remove(msg.chat.id, msg.from.id);

  const quote = `<a href="tg://user?id=${msg.from.id}">${msg.from.first_name}</a>`;
  bot.sendMessage(msg.chat.id, `O personagem ${data.name} foi desassociado de você ${quote}`, { parse_mode: 'HTML', disable_notification: true });
};

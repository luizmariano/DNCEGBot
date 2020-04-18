process.env.NTBA_FIX_319 = 1;
require('dotenv').config();
const TelegramBot = require('node-telegram-bot-api');
const bot = new TelegramBot(process.env.TALEGRAM, { polling: true });
const TagoDevice = require('tago/device');
const tago = new TagoDevice(process.env.TAGO);
const initiative = require('./services/initative/index');
const roll       = require('./services/roll/roll');
const rrroll     = require('./services/roll/rrroll');
const check      = require('./services/roll/check');
const save       = require('./services/roll/save');
const ficha      = require('./services/beyond/ficha');
const storeCharacter   = require('./services/beyond/storeCharacter');
const spellLookUp      = require('./services/lookup/spells');
const featLookUp      = require('./services/lookup/feats');

bot.sendStructedMessage = async (msg, text, opt = {}) =>  {
  await bot.sendMessage(
    msg.chat.id,
    Array.isArray(text) ? text.join('\n') : text,
    { parse_mode: 'MARKDOWN', disable_notification: true, ...opt },
  );
};


bot.onText(/^(\/r)\b/i, async (msg) => {
  const text = msg.text.split(' ');
  if (text[2] && ['van', 'des'].includes(text[2].toLowerCase())) text[2] = text[2].toLowerCase();

  if (text[1] === 'ajuda') {
    return bot.sendStructedMessage(msg, [
      '[Comando] - [Descrição]',
      '/r `<dado> [Desc]` - _Rolagem de dados._',
      '/r `<dado> van [Desc]` - _Rolagem de dados com vantagem._',
      '/r `<dado> des [Desc]` - _Rolagem de dados com desvantagem._',
      '/r `<dado>-L` - _Remove o menor resultado._ ',
      '/r `<dado>-H` - _Remove o maior resultado._ ',
      '/r `<dado>!` - _Explode o dado.._ ',
      '/r `4dF` - _Rolagem Fudge/Fate.._ ',
      '/r `4dF.1` - _Rolagem Fudge/Fate.._ ',
      '/r `1d10>=4` - _Rolagem somando somente os dados >= que 4.._ ',
      '/r `1d10<=4` - _Rolagem somando somente os dados <= que 4.._ ',
    ]);
  }

  await roll(bot, msg, text).catch(console.log);
});

bot.onText(/^(\/rrr)\b/i, async (msg) => {
  const text = msg.text.split(' ');
  await rrroll(bot, msg, text);
});

bot.onText(/^(\/check)\b/i, async (msg) => {
  const text = msg.text.toLowerCase().split(' ');
  await check(bot, msg, text);
});

bot.onText(/^(\/save)\b/i, async (msg) => {
  const text = msg.text.toLowerCase().split(' ');
  await save(bot, msg, text);
});

bot.onText(/^(\/init)\b/i, async (msg) => {
  await initiative(bot, msg);
});


bot.onText(/^(\/personagem)\b/i, async (msg) => {
  const text = msg.text.split(' ');
  await storeCharacter(bot, msg, text[1]);
});

bot.onText(/^(\/ficha)\b/i, async (msg) => {
  await ficha(bot, msg);
});


bot.onText(/^(\/magi)/i, async (msg) => {
  await spellLookUp(bot, msg);
});


bot.onText(/^(\/carac)/i, async (msg) => {
  await featLookUp(bot, msg);
});

bot.onText(/^(\/ajuda)\b/i, async (msg) => {
  bot.sendStructedMessage(msg, [
    '*Rolagens*',
    '/r `ajuda` - _Instruções sobre comandos de rolagem._',
    '/rrr `<N> <dado> <CA>` -  _Multiplas rolagens de dados contra CA._',
    '/check `<atributo> <van/des>` - _Faz um teste de perícia/atributo._.',
    '/save `<atributo> <van/des>` - _Faz um teste de resistência_.',
    '',
    '*Jogo*',
    '/init `ajuda` -  _Instruções sobre comandos de iniciativa._',
    '/personagem `<link>` -  _Associa ficha Beyond/_[gsheets](https://docs.google.com/spreadsheets/d/1ApmbXHTln99fPTUpanyQRTXNzXbQ8UBTt3Uq8xInQKw/edit) _a você._',
    '/ficha [@mention] - _Exibe informações sobre uma ficha_.',
    '',
    '*Pesquisa*',
    '/magia `<magia>` - _Exibe informações sobre uma magia (ingles)_.',
    '/carac `<carac>` - _Exibe informações sobre uma caracteristica (ing)_.',
    '       `-c` - _Procura nas caracteristicas de classe._',
  ]);

  if (msg.chat.type.includes('group')) {
    const [exist] = await tago.find({ variable: 'channel_id', value: msg.chat.id });
    if (!exist) tago.insert([{ variable: 'channel_id', value: msg.chat.id }, { variable: 'channel_name', value: msg.chat.title }]);
  }
});

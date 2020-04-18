const TagoDevice = require('tago/device');
const tago = new TagoDevice(process.env.TAGO);

async function save(chat, id, url, name) {
  const serie = `${chat}_${id}`;
  await tago.remove({ variables: ['user_url', 'user_name'], serie, qty: 100 });
  await tago.insert([{ variable: 'user_url', serie, value: url }, { variable: 'user_name', serie, value: name }]);
  return true;
}

async function load(chat, id, usr_name) {
  const serie = `${chat}_${id}`;
  const [url, name] = await tago.find({ variable: ['user_url', 'user_name'], serie, qty: 1 });
  if (!url) return false;

  if (!name || name.value !== usr_name) {
    await tago.remove({ variable: 'user_name', serie, qty: 5 });
    await tago.insert({ variable: 'user_name', serie, value: usr_name });
  }

  return url ? url.value : null;
}

async function remove(chat, id) {
  const serie = `${chat}_${id}`;
  await tago.remove({ variables: ['user_url', 'user_name'], serie, qty: 100 });
  return true;
}


async function getUser(chat, name) {
  const users = await tago.find({ variable: 'user_name', value: name, qty: 100 });
  const user_id = users.find(x => x.serie.includes(String(chat)));
  return user_id ? user_id.serie.replace(`${chat}_`, '') : null;
}


module.exports = { save, load, remove, getUser };

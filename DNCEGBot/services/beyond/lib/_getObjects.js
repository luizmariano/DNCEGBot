function getObjects(obj, key, val, except) {
  except = except || [];
  let objects = [];
  for (const i in obj) {
    if (!obj.hasOwnProperty(i)) continue;
    if (typeof obj[i] === 'object') {
      if (except.includes(i)) {
        continue;
      }
      objects = objects.concat(getObjects(obj[i], key, val));
    // if key matches and value matches or if key matches and value is not passed (eliminating the case where key matches but passed value does not)
    } else if (i === key && obj[i] === val || i === key && val === '') { //
      objects.push(obj);
    } else if (obj[i] === val && key === '') {
      // only add if the object is not already in the array
      if (objects.lastIndexOf(obj) === -1) {
        objects.push(obj);
      }
    }
  }
  return objects;
}

module.exports = getObjects;

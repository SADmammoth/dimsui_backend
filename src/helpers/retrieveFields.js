function retrieveFields(object, keys, unsetEmpty = false) {
  let result = {};
  let unset = {};

  keys.forEach((key) => {
    if (object[key]) {
      result[key] = object[key];
    } else if (unsetEmpty) {
      unset[key] = '';
      result.$unset = unset;
    }
  });

  return result;
}

module.exports = retrieveFields;

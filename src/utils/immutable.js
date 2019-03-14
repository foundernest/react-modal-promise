export function insertArrayItem(array, item) {
  return [...array, item];
}

export function removeArrayItemByIndex(array, index) {
  let newArray = array.slice();
  newArray.splice(index, 1);
  return newArray;
}

export function removeArrayItem(array, equalityCallback) {
  const index = getArrayIndexOfItem(array, equalityCallback);
  if (index > 0) {
    return removeArrayItemByIndex(array, index);
  } else {
    return array;
  }
}

export function getArrayIndexOfItem(array, equalityCallback) {
  for (let i = 0, l = array.length; i < l; i++) {
    let item = array[i];
    if (equalityCallback(item)) return i;
  }
  return -1;
}

export function insertObjectItem(object, item) {
  return { ...object, ...item };
}

export function removeObjectItemByKey(object, key) {
  const { [key]: _, ...newKeys } = object;
  return newKeys;
}

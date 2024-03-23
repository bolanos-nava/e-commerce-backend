export function capitalize(str = '') {
  const strToArray = str.split('');
  return [strToArray[0].toUpperCase(), ...strToArray.slice(1)].join('');
}

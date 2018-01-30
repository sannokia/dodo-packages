export default function(value) {
  if (!value) {
    return;
  }

  return value.match(/\d/g) !== null;
}

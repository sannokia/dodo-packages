export default function(value) {
  if (!value) {
    return;
  }

  return value.match(/[a-zA-Z]/g) !== null;
}

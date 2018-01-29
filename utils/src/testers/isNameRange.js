export default function(name) {

  if (!name) {
    return false;
  }

  return /^[a-zA-Z0-9_-\s]{5,90}$/g.test(name.trim());
}

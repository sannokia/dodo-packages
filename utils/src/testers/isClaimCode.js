export default function(code) {
  return /^[a-zA-Z0-9]{4}\-[a-zA-Z0-9]{4}\-[a-zA-Z0-9]{4}$/.test(String(code));
}

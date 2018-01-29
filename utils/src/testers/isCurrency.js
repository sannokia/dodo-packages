export default function(amount) {
  return /^[0-9]\d*(((,?\d{3}){1})*?(\.\d{0,2})?)$/.test(String(amount));
}

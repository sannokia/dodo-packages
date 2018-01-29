export default function(bic) {
  return /^([a-zA-Z]{4}[a-zA-Z]{2}[a-zA-Z0-9]{2}([a-zA-Z0-9]{3})?)$/.test(bic);
}

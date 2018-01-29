export default function(iban) {
  return /^[a-zA-Z]{2}[0-9]{2}[a-zA-Z0-9]{11,27}$/g.test(iban.replace(/\s+/g, ''));
}

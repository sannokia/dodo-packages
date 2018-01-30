export default function(phone) {
  return /\(.\d{1,3}\)\s*\d{8,20}/g.test(phone);
}

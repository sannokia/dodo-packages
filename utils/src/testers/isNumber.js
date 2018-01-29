export default function(number) {
  return /^\d+(\.\d{1,2})?/g.test(number);
}

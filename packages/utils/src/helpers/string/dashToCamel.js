export default function(input) {
  return input.replace(/-(.)/g, function(match, group1) {
    return group1.toUpperCase();
  });
}

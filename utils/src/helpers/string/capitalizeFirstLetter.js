export default function capitalizeFirstLetter(string) {
  return string.length > 1 ? string.charAt(0).toUpperCase() + string.slice(1) : string;
}

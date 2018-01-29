export default function(password) {

  var minlength = (password.length >= 8);
  var maxlength = (password.length <= 15);
  var containNumbers = (password.match(/\d/g) !== null);
  var containChars = (password.match(/[a-zA-Z]/g) !== null);

  return (minlength && maxlength && containNumbers && containChars);
}

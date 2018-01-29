export default function(accountNumber) {

  var minlength = (accountNumber.length >= 4);

  var maxlength = (accountNumber.length <= 20);

  return (minlength && maxlength);
}

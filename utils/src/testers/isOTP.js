export default function(otp) {
  return /^\d{8}$/.test(otp);
}

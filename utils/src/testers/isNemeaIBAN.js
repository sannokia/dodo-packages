export default function(nemeaIban) {
  return /^MT[0-9]{2}NMEA25014[0-9]{18}$/g.test(nemeaIban.replace(/\s+/g, ''));
}

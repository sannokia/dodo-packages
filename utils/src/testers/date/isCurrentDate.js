import moment from 'moment';

export default function(d) {

  var begin = moment().subtract('years', 115);

  var end = moment();

  return ((d >= begin) && (d > end));

}

import moment from 'moment';

export default function(d) {
  var begin = moment().add('days', -1);

  var end = moment().add('years', 50);

  return !(d >= begin && d <= end);
}

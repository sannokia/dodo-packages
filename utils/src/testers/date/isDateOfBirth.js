import moment from 'moment';

export default function(d) {

  var begin = moment().subtract('years', 100);

  var end = moment().subtract('years', 16);

  return !((d >= begin) && (d <= end));

}

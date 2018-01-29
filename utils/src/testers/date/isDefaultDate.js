import moment from 'moment';

export default function(d) {

  var begin = moment().subtract('years', 100);

  var end = moment().add('years', 50);

  return !((d >= begin) && (d <= end));

}

import moment from 'moment';

export default function(rate, maturity, amount) {

  var today = moment();
  var endDate = moment().add('months', maturity);
  var period = endDate.diff(today, 'days');

  var accrued = amount * (rate/365) * period;

  return accrued;

}

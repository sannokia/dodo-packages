import moment from 'moment';

const LAST_N_DAYS_VALUE = 90;

export default {
  lastNDays() {
    var endDate = moment();
    var startDate = moment(endDate).subtract(LAST_N_DAYS_VALUE, 'days');

    return {
      startDate,
      endDate
    };
  },

  recent() {
    var endDate = moment();
    var startDate = moment('2013-01-01');

    return {
      startDate,
      endDate
    };
  },

  current_month() {
    var endDate = moment();
    var startDate = moment().startOf('month');

    return {
      startDate,
      endDate
    };
  },

  last_month() {
    var endDate = moment().subtract(1, 'M').endOf('month');
    var startDate = moment().subtract(1, 'M').startOf('month');

    return {
      startDate,
      endDate
    };
  },

  today() {
    var endDate = moment();
    var startDate = moment();

    return {
      startDate,
      endDate
    };
  },

  yesterday() {
    var endDate = moment().subtract(1, 'd');
    var startDate = endDate;

    return {
      startDate,
      endDate
    };
  },

  this_week() {
    var endDate = moment();
    var startDate = moment().startOf('week');

    return {
      startDate,
      endDate
    };
  },

  last_week() {
    var currentWeek = moment().startOf('week');
    var startDate = currentWeek.subtract(1, 'w');
    var endDate = startDate.clone().endOf('week');

    return {
      startDate,
      endDate
    };
  },

  yearly(year) {
    var startDate = moment(year + '-01-01', 'YYYY-MM-DD');
    var endDate = moment(year + '-12-31', 'YYYY-MM-DD');

    return {
      startDate,
      endDate
    };
  },

  range(year, dateRange) {

    var startDate = moment().subtract(200, 'years');
    var endDate = moment().subtract(200, 'years');

    if (dateRange && dateRange.from && dateRange.to) {
      startDate = moment(dateRange.from);
      endDate = moment(dateRange.to);
    }

    return {
      startDate,
      endDate
    };
  }
};

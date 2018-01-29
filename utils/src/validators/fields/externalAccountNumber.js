import ValidatorFactory from '../ValidatorFactory';
import maxLength from '../common/maxLength';
import minLength from '../common/minLength';

var max = 20;
var min = 4;

export default ValidatorFactory.create({
  validators: [
    minLength.extend({min}),
    maxLength.extend({max})
  ]
});

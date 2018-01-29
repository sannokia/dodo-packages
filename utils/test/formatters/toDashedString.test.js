import chai from 'chai';
import toDashedString from '../../lib/formatters/toDashedString.js';

suite('toDashedString', () => {

  test('"thisIsCamelCased" => "this-is-camel-cased"', () => {
    var res = toDashedString('thisIsCamelCased');
    chai.assert.equal(res, 'this-is-camel-cased');
  });

  test('"this-is-kebab-cased" => "this-is-kebab-cased"', () => {
    var res = toDashedString('this-is-kebab-cased');
    chai.assert.equal(res, 'this-is-kebab-cased');
  });

  test('"this_is_snake_cased" => "this_is_snake_cased"', () => {
    var res = toDashedString('this_is_snake_cased');
    chai.assert.equal(res, 'this_is_snake_cased');
  });

});

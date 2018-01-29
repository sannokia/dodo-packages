import canTransactionBeAuthorised from '../../../lib/helpers/data/canTransactionBeAuthorised.js';
var chai = require('chai');

suite('canTransactionBeAuthorised', () => {

  test('should pass', () => {
    var systemUserId = 123;
    var data = {
      authorisers: [
        {
          id: systemUserId,
          authorisationStatus: 'PENDING'
        }
      ],
      transaction: {
        status: 'PENDING_AUTHORISATION'
      }
    };
    chai.assert.isTrue(canTransactionBeAuthorised(data, systemUserId));
  });

});

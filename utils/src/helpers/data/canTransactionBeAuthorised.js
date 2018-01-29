import _some from 'lodash/some';

export default function(data, systemUserId) {
  var {
    authorisers,
    transaction
  } = data;

  return transaction.status === 'PENDING_AUTHORISATION' && _some(authorisers, authoriser => authoriser.id === systemUserId && authoriser.authorisationStatus === 'PENDING');
}

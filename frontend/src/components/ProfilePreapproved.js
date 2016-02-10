import React, { PropTypes } from 'react';

import Currency from './Currency';

const ProfilePreapproved = ({
  preapprovalDetails,
  getPreapprovalKey,
  userid
}) => {
  const {
    curPaymentsAmount,
    maxTotalAmountOfAllPayments,
  } = preapprovalDetails;

  const max = parseFloat(maxTotalAmountOfAllPayments);
  const current = parseFloat(curPaymentsAmount);

  return (
   <div className='ProfilePreapproved'>
    <div className='ProfilePreapproved-balance'>
      Preapproved for <Currency value={max} precision={2} /> (
      <Currency value={max - current} precision={2} /> remaining)
    </div>
    <div
      className='ProfilePreapproved-reapprove'
      onClick={getPreapprovalKey.bind(this, userid)}>
      Reapprove for <Currency value={2000} precision={2} />
    </div>
   </div>
  );
};

ProfilePreapproved.propTypes = {
  userid: PropTypes.number.isRequired,
  preapprovalDetails: PropTypes.shape({
    maxTotalAmountOfAllPayments: PropTypes.string.isRequired,
    curPaymentsAmount: PropTypes.string.isRequired
  }),
  getPreapprovalKey: PropTypes.func.isRequired
};

export default ProfilePreapproved;


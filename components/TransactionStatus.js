import React, { PropTypes } from 'react';
import Icon from './Icon';

const TransactionStatus = ({approved, approvedAt, amount, reimbursedAt}) => {
  let status = 'Pending';
  let iconType = 'pending';

  if (!!reimbursedAt) {
    status = 'Reimbursed';
    iconType = 'approved';
  } else if (approvedAt && approved) {
    status = 'Approved';
    iconType = 'approved';
  } else if (approvedAt && !approved) {
    status = 'Rejected';
    iconType = 'rejected';
  } else if (amount > 0) {
    status = '';
    iconType = '';
  }

  return (
    <span className='TransactionStatus'>
      <Icon type={iconType} />{status}
    </span>
  );
}

TransactionStatus.propTypes = {
  approvedAt: PropTypes.string,
  approved: PropTypes.bool.isRequired
};

export default TransactionStatus;

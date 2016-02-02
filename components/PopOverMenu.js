import React, { PropTypes } from 'react';
import { Link } from 'react-router';
import classnames from 'classnames';

const PopOverMenu = ({showPopOverMenu, groupid, hasPopOverMenuOpen, showAddFunds}) => {
  const className = classnames({
    'PopOverMenu': true,
    'PopOverMenu--open': hasPopOverMenuOpen
  });

  return (
    <div className={className}>
      <div className='PopOverMenu-group'>
      {showAddFunds ?
        <div className='PopOverMenu-item js-addFundsLink'>
          <Link to={`/app/groups/${groupid}/funds/`}>
            Add funds
          </Link>
        </div>
        : null
      }
        <div className='PopOverMenu-item js-transactionNewLink'>
          <Link to={`/app/groups/${groupid}/transactions/new`}>
            Add expense
          </Link>
        </div>
      </div>

      <div
        className='PopOverMenu-cancel'
        onClick={() => showPopOverMenu(false)}>
        Cancel
      </div>
    </div>
  );
};

PopOverMenu.propTypes = {
  showPopOverMenu: PropTypes.func.isRequired
};

export default PopOverMenu;

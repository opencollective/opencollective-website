import React, { PropTypes } from 'react';
import formatCurrency from '../lib/format_currency';
import classNames from 'classnames';

const Currency = ({value = 0, currency = 'USD', precision=0, compact=true}) => {

  const className = classNames({
    'Currency': true,
    'Currency--green': (value >= 0),
    'Currency--red': (value < 0),
  });

  precision = parseInt(precision, 10);

  return <span className={className}>{formatCurrency(value, currency, {precision, compact})}</span>;
};

Currency.propTypes = {
  value: PropTypes.number.isRequired
};

Currency.defaultProps = {
  value: 0
};

export default Currency;

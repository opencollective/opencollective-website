import React, { Component, PropTypes } from 'react';

import ConnectStripeButton from './ConnectStripeButton';

class StripeAuth extends Component {
  render() {
    const {
      stripeAccount,
      onClick,
      onClickInProgress,
      i18n,
      loading
    } = this.props;

    return (
      <div className='StripeAuth'>
        {loading && <img src='/public/images/loading.gif' />}
        {!stripeAccount && !loading && 
          <div>
            { i18n.getString('stripeAuthNeedAccount') }
            <ConnectStripeButton
              disabled={ onClickInProgress }
              onClick={ onClick }
              inProgress={ onClickInProgress }
              i18n={i18n}
            />
          </div>}
        {stripeAccount && !loading && i18n.getString('stripeAuthAccountConnected') }
      </div>
    );
  }
}

StripeAuth.propTypes = {
  i18n: PropTypes.object.isRequired,
  onClick: PropTypes.func.isRequired,
  stripeAccount: PropTypes.object,
  onClickInProgress: PropTypes.bool,
  loading: PropTypes.bool,
};

export default StripeAuth;

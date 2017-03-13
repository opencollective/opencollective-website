import React, { Component, PropTypes } from 'react';

import ConnectPaypalButton from './ConnectPaypalButton';

class PaypalPreapproval extends Component {
  render() {
    const {
      card,
      onClick,
      onClickInProgress,
      i18n,
      loading
    } = this.props;

    return (
      <div className='PaypalPreapproval'>
        {loading && <img src='/public/images/loading.gif' />}
        {!card && !loading && 
          <div>
            { i18n.getString('paypalPreapprovalNeedValidAccount') }
            <ConnectPaypalButton
              disabled={ onClickInProgress }
              onClick={ onClick }
              inProgress={ onClickInProgress }
              i18n={i18n}
            />
          </div>}
        {card && !loading &&
          <div>
          { `${i18n.getString('paypalPreapprovalAccountLinked')} ${card.number}.`} 
          <span className='PaypalPreapproval-switch ml1' onClick={ onClick }> {i18n.getString('paypalPreapprovalRefreshKey')} </span>
          </div>}

      </div>
    );
  }
}

PaypalPreapproval.propTypes = {
  i18n: PropTypes.object.isRequired,
  onClick: PropTypes.func.isRequired,
  card: PropTypes.object,
  onClickInProgress: PropTypes.bool,
  loading: PropTypes.bool,
};

export default PaypalPreapproval;

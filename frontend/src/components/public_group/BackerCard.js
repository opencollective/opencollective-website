import React, {Component} from 'react';

import DonationDistributor from './DonationDistributor';
import UserPhoto from '../UserPhoto';

export default class BackerCard extends Component {

  constructor(props) {
    super(props);
  }

  render() {
    const {user, group, title, showButton, donationForm} = this.props;
    const tier = group.tiers[0]
    donationForm[tier.name] = donationForm[tier.name] || {};
    const stripeKey = group.stripeAccount && group.stripeAccount.stripePublishableKey;
    const amount = donationForm[tier.name].amount !== undefined ? donationForm[tier.name].amount : tier.range[0];
    const frequency = donationForm[tier.name].frequency || tier.interval;
    const currency = donationForm[tier.name].currency || group.currency;
    const hasPaypal = group.hasPaypal;
    const hasStripe = stripeKey && amount !== '';
    const collectives = [
      {id: group.id, name: group.name, logo: group.logo},
    ];
    return (
      <div className='BackerCard'>
        <UserPhoto user={user} addBadge={true} customBadge='svg-star-badge' customBadgeSize='20' />
        <div className='BackerCard-title'>{title}</div>
        {showButton && <DonationDistributor
          amount={10.00}
          method={(hasPaypal) ? 'paypal' : (hasStripe) ? 'stripe' : 'paypal'}
          currency={currency}
          frequency={frequency}
          editable={false}
          optionalComission={false}
          feesOnTop={true}
          collectives={collectives}
          buttonLabel={'become backer'}
          skipModal={true}
          group={group}
          {...this.props}
          />
        }
      </div>
    );
  }
}

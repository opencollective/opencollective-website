import React, {Component, PropTypes} from 'react';
import Currency from './Currency';
import UserPhoto from './UserPhoto';

export default class ActivityItem extends Component {
  static propTypes = {
    donation: PropTypes.object.isRequired,
    user: PropTypes.object
  };

  static defaultProps = {
    donation: {},
    user: {
      name: 'Anonymous',
      avatar: '/static/images/default_avatar.svg'
    }
  };

  render() {
    const { className = '', donation, user, i18n } = this.props;
    return (
      <div className={`ActivityItem flex ${className}`}>
        <UserPhoto user={user} className='mt1' />
        <div className='ActivityItem-bubble relative flex-auto border bg-white ml2 p2'>
          <div className='flex'>
            <p className='h5 flex-auto m0'>{donation.title}</p>
            <span className='h6 muted'>{donation.createdAt && i18n.moment(donation.createdAt).fromNow()}</span>
          </div>
          <p className='h3 mb0 mt2 -ff-sec -fw-bold'>
            <Currency value={donation.amount} currency={donation.currency} colorify={false} />
          </p>
        </div>
      </div>
    );
  }
}

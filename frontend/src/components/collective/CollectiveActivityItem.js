import React, {Component, PropTypes} from 'react';
import Currency from '../../components/Currency';
import UserPhoto from '../../components/UserPhoto';

export default class CollectiveActivityItem extends Component {
  static propTypes = {
    transaction: PropTypes.object.isRequired,
    user: PropTypes.object
  };

  static defaultProps = {
    transaction: {},
    user: {
      name: 'Anonymous',
      avatar: '/static/images/default_avatar.svg'
    }
  };

  render() {
    const { className = '', transaction, user, i18n } = this.props;
    return (
      <div className={`CollectiveActivityItem flex border-bottom border-gray ${className}`}>
        <UserPhoto user={ user } className='mt1' />
        <div className='CollectiveActivityItem-info ml1 p1 flex-auto'>
          <div className='flex'>
            <p className='h5 m0 left truncate flex-auto' title={ transaction.title || transaction.description }>
              { transaction.title || transaction.description }
            </p>
            <p className='h4 m0 ml1 nowrap right-align -ff-sec'>
              <Currency value={transaction.amount} currency={transaction.currency} precision={2}/>
            </p>
          </div>
          <div className='h6 muted timestamp'>{transaction.createdAt && i18n.moment(transaction.createdAt).fromNow()}</div>
        </div>
      </div>
    );
  }
}

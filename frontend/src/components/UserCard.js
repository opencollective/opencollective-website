import React, {Component, PropTypes} from 'react';
import UserPhoto from './UserPhoto';
import moment from 'moment';

export default class UserCard extends Component {
  static propTypes = { user: PropTypes.object };

  static defaultProps = {
    user: {
      avatar: '/static/images/default_avatar.svg',
      name: '',
      role: '',
      tier: '',
      totalDonations: 0,
      twitterHandle: '',
      website: ''
    }
  };

  _link(href, children) {
    if (href) {
      return (<a href={href} className='inline-block align-top'>{children}</a>);
    }

    return children;
  }

  render() {
    const { className = '', user } = this.props;
    let twitterUrl;
    if (user.twitterHandle) {
      twitterUrl = `https://twitter.com/${user.twitterHandle}`;
    }

    const href = (user.website || twitterUrl);

    return (
      <article className={`UserCard bg-white ${className}`}>
        {this._link(href, <UserPhoto url={user.avatar} className='mx-auto' />)}
        <p className='h5 mt2 mb1 -ff-sec'>{this._link(href, user.name)}</p>
        <p className='h6 muted m0'>since {moment(user.createdAt).format('MMMM YYYY')}</p>
      </article>
    );
  }
}

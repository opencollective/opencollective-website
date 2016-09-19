import React, {Component, PropTypes} from 'react';
import UserPhoto from './UserPhoto';

export default class UserCard extends Component {
  static propTypes = { user: PropTypes.object };

  static defaultProps = {
    user: {
      avatar: $assets.image('default_avatar.svg'),
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
      return (<a href={href} target='_blank' className='inline-block align-top'>{children}</a>);
    }

    return children;
  }

  render() {
    const { className = '', user, i18n } = this.props;

    const twitterUrl = (user.twitterHandle) ? `https://twitter.com/${user.twitterHandle}` : '';
    const href = (user.website || twitterUrl);

    const roleLabel = (user.tier || user.role).toLowerCase();
    const addBadge = (roleLabel !== 'sponsor' && roleLabel !== 'member');

    return (
      <article className={`UserCard bg-white pt3 ${className} ${user.tier}`}>
        {this._link(href, <UserPhoto user={user} addBadge={addBadge} className='mx-auto' />)}
        <p className='UserCard-name PublicGroup-font-15 h5 my2 px2 -ff-sec'>{this._link(href, user.name)}</p>
        <div className='border-top border-gray px3 py2'>
          <p className='UserCard-role m0 -green -fw-bold -ttu'>{i18n.getString(roleLabel)}</p>
          <p className='h6 muted m0'>{i18n.getString('since')} {i18n.moment(user.createdAt).format('MMMM YYYY')}</p>
        </div>
      </article>
    );
  }
}

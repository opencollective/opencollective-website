import React from 'react';
import getAvatarByNumber from '../lib/avatar_by_number';

export default class UserPhoto extends React.Component {
  static propTypes = {
    user: React.PropTypes.object,
    addBadge: React.PropTypes.bool
  };

  static defaultProps = {
    addBadge: false
  };

  render() {
    const { className = '', user, addBadge } = this.props;
    const avatar = (user.avatar || getAvatarByNumber(user.id));
    const styles = {
      backgroundImage: `url(${avatar})`
    };

    return (
      <div className={`UserPhoto circle bg-light-gray bg-no-repeat bg-center relative ${className}`}>
        <div className='width-100 height-100 circle bg-cover bg-center' style={styles}></div>
        {addBadge ? (
          <div className='UserPhoto-badge absolute bg-white circle'>
            <svg className='block -green' width='14' height='14'>
              <use xlinkHref='#svg-isotype'/>
            </svg>
          </div>
        ) : null}
      </div>
    );
  }
}

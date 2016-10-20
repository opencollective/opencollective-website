import React, {Component, PropTypes} from 'react';

import unionBy from 'lodash/unionBy';

const MAX_SHOWING = 15;

export default class UserAvatarRow extends Component {

  render() {
    const {
      backers,
      members
    } = this.props;

    const users = unionBy(members, backers, 'username');
    console.log(users);
    const usersToShow = users.filter(u => u.avatar ? true : false).slice(MAX_SHOWING);
    if (users.length === 0 || usersToShow.length === 0 ) {
      return (<div />);
    }
    return (
      <div className='UserAvatarRow'>
        <span className='UserAvatarRow-shots'>
          {usersToShow.map(u =>
            <span className='UserAvatarRow-avatar' key={u.username} style={{backgroundImage: `url(${u.avatar})`}} />)}
        </span>
        <span className='UserAvatarRowCount'> <a href='#contributors'> {`+${users.length - usersToShow.length}`} </a></span>
      </div>
    );
  }
}

UserAvatarRow.propTypes = {
  backers: PropTypes.array,
  members: PropTypes.array,
};
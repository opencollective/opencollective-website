import React, {Component, PropTypes} from 'react';

import unionBy from 'lodash/unionBy';

const MAX_SHOWING = 12;

export default class UserAvatarRow extends Component {

  render() {
    const {
      backers,
      members
    } = this.props;

    const all = unionBy(members, backers, 'username');
    const toShow = all.filter(u => u.avatar && u.avatar.indexOf('http') !== -1 ? true : false).slice(0, MAX_SHOWING-1);

    if (all.length === 0 || toShow.length === 0 ) {
      return (<div />);
    }
    return (
      <div className='UserAvatarRow'>
        <span className='UserAvatarRow-shots'>
          {toShow.map(u =>
            <span className='UserAvatarRow-avatar' key={u.username} style={{backgroundImage: `url(${u.avatar})`}} />)}
        </span>
        <span className='UserAvatarRowCount'> <a href='#contributors'> {`+${all.length - toShow.length}`} </a></span>
      </div>
    );
  }
}

UserAvatarRow.propTypes = {
  backers: PropTypes.array,
  members: PropTypes.array,
};
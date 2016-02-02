import React, { PropTypes, Component } from 'react';
import { Link } from 'react-router';

import listensToClickOutside from 'react-onclickoutside/decorator';
import Icon from './Icon';
import PopOverMenu from './PopOverMenu';

class Footer extends Component {

  handleClickOutside() {
    // Hide menu when clicked outside
    if (this.props.hasPopOverMenuOpen) {
      this.props.showPopOverMenu(false);
    }
  }

  render() {
    const {
      groupid,
      hasPopOverMenuOpen,
      showPopOverMenu,
      isHost,
    } = this.props;

    return (
      <div className='Footer'>
        <div
          className='Footer-addButton'
          onClick={() => showPopOverMenu(true)} >
          <Icon type='add' />
        </div>
        <div className='Footer-popOverMenu'>
            <PopOverMenu
              groupid={groupid}
              showPopOverMenu={showPopOverMenu}
              hasPopOverMenuOpen={hasPopOverMenuOpen}
              showAddFunds={isHost} />
        </div>
        <div className='Footer-left'>
          <Link to='/app/profile'>
            <div className='Footer-userIcon'></div>
          </Link>
        </div>
      </div>
    );
  }
}

Footer.propTypes = {
  groupid: PropTypes.string.isRequired
};

export default listensToClickOutside(Footer);

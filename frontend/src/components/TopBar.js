import React, { PropTypes } from 'react';
import { Link } from 'react-router';

import BackButton from './BackButton';
import GroupSettingsButton from './GroupSettingsButton';

const TopBar = ({
  hasBackButton,
  title,
  backLink,
  groupSettingsLink,
  rightLink
}) => {
  return (
    <div className='TopBar'>
      <span className='TopBar-backButton'>
        {hasBackButton || backLink ? <BackButton backLink={backLink}/> : null}
      </span>
      <div className='TopBar-title'>{title}</div>
      {groupSettingsLink && (
        <span className='TopBar-groupSettingsButton'>
          {groupSettingsLink ? <GroupSettingsButton groupSettingsLink={groupSettingsLink}/> : null }
        </span>
      )}

      {rightLink.url && rightLink.label && (
        <div className='TopBar-rightLink'>
          <Link to={rightLink.url}>{rightLink.label}</Link>
        </div>
      )}
    </div>
  );
}

TopBar.propTypes = {
  hasBackButton: PropTypes.bool,
  title: PropTypes.string.isRequired,
  backLink: PropTypes.string
};

TopBar.defaultProps = {
  hasBackButton: false,
  title: '',
  rightLink: {}
};

export default TopBar;


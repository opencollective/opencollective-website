import React, {Component, PropTypes} from 'react';

export default class UserPhoto extends Component {
  static propTypes = { url: PropTypes.string };

  static defaultProps = {
    url: '/static/images/default_avatar.svg',
    addBadge: false
  };

  render() {
    const { className = '', url, addBadge } = this.props;
    const avatar = (url || '/static/images/default_avatar.svg');

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

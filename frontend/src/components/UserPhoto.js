import React, {Component, PropTypes} from 'react';

export default class UserPhoto extends Component {
  static propTypes = { url: PropTypes.string }

  static defaultProps = {
    url: '/static/images/default_avatar.svg'
  }

  render() {
    const {className = '', url, ...other} = this.props;
    const avatar = (url || '/static/images/default_avatar.svg');

    const styles = {
      backgroundImage: `url(${avatar})`
    }

    return (
      <div className={`UserPhoto circle bg-light-gray bg-no-repeat bg-center overflow-hidden ${className}`}>
        <div className='width-100 height-100 bg-cover bg-center' style={styles}></div>
      </div>
    );
  }
}

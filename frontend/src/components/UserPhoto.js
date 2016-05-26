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

  componentDidMount() {
    const { user } = this.props;
    if (user.avatar) {
      const image = new Image();
      image.onerror = () => this.setState({avatar: getAvatarByNumber(user.id)});
      image.onload = () => this.setState({avatar: user.avatar});
      image.src = user.avatar;
    }
    else {
      this.setState({avatar: getAvatarByNumber(user.id)});
    }
  }

  constructor(props) {
    super(props);
    this.state = {avatar: ''};
  }

  render() {
    const { className, user, addBadge } = this.props;
    const avatar = this.state.avatar;
    const styles = {
      backgroundImage: `url(${avatar})`
    };

    return (
      <div className={`UserPhoto bg-light-gray bg-no-repeat bg-center relative ${user.tier} ${className} ${avatar ? 'UserPhoto--loaded' : ''} `}>
        <div className='width-100 height-100 bg-contain bg-no-repeat bg-center' style={styles}></div>
        {addBadge ? (
          <div className='UserPhoto-badge absolute bg-white'>
            <svg className='block -green' width='14' height='14'>
              <use xlinkHref='#svg-isotype'/>
            </svg>
          </div>
        ) : null}
      </div>
    );
  }
}

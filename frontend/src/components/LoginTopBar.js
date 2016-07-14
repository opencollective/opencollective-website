import React, { Component, PropTypes } from 'react';

export default class OnBoardingHeader extends Component {

  static propTypes = {
    user: PropTypes.shape({
      name: PropTypes.string,
      avatar: PropTypes.string
    })
  }

  static defaultProps = {
    user: null
  }

  constructor(props) {
    super(props);
    this.state = {
      isLoggedIn: Boolean(props.user),
      showProfileMenu: false
    };
  }

  renderProfileMenu() {
    return (
      <div className='LoginTopBarProfileMenu' onClick={(e) => e.nativeEvent.stopImmediatePropagation()}>
        <div>
          <div className='LoginTopBarProfileMenuHeading'>
            <span>collectives</span>
            <div className='-dash'></div>
          </div>
          <ul>
            <li><a href='#'>Subscriptions</a></li>
            <li><a href='#'>Contributors</a></li>
          </ul>
        </div>
        <div>
          <div className='LoginTopBarProfileMenuHeading'>
            <span>my account</span>
            <div className='-dash'></div>
          </div>
          <ul>
            <li><a href='#'>Profile</a></li>
            <li><a className='-blue' href='/logout'>Log Out</a></li>
          </ul>
        </div>
      </div>
    )
  }

  render() {
    const { user } = this.props;
    const { isLoggedIn, showProfileMenu } = this.state;
    const avatar = isLoggedIn ? user.avatar : null;
    const name = isLoggedIn ? user.name : null;
    return (
      <div className='LoginTopBar'>
        <a href="/">
          <div className='LoginTopBar-logo'></div>
        </a>
        <div className='LoginTopBar-nav'>
          <a className='LoginTopBarButton' href='#'>start a collective</a>
          <a className='LoginTopBarLink' href='/how'>How it works</a>
          <a className='LoginTopBarLink' href='/discover'>Discover</a>
          <div className='LoginTopBarSeperator'></div>
          {isLoggedIn && 
            <div className={`LoginTopBarProfileButton ${showProfileMenu ? '-active' : ''}`} onClick={this.toggleProfileMenu.bind(this)}>
              {avatar && <div className='LoginTopBarProfileButton-avatar' style={{backgroundImage: `url(${avatar})`}}></div>}
              {name && <div className='LoginTopBarProfileButton-name'>{name}</div>}
              <div className='LoginTopBarProfileButton-caret'></div>
              {showProfileMenu && this.renderProfileMenu()}
            </div>
          }
          {!isLoggedIn && <a className='LoginTopBarLink' href='/login'>Login</a>}
          {!isLoggedIn && <a className='LoginTopBarLink -blue' href='/register'>Sign up</a>}
        </div>
      </div>
    )
  }

  componentDidMount() {
    this.onClickOutsideRef = this.onClickOutside.bind(this);
    document.addEventListener('click', this.onClickOutsideRef);
  }

  componentWillUnmount() {
    document.removeEventListener('click', this.onClickOutsideRef);
  }

  onClickOutside() {
    this.setState({showProfileMenu: false});
  }

  toggleProfileMenu(e) {
    if (e.target.className.indexOf('LoginTopBarProfileButton') !== -1) {
      this.setState({showProfileMenu: !this.state.showProfileMenu});
      e.nativeEvent.stopImmediatePropagation();
    }
  }
}

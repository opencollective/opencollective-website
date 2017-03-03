import React from 'react';
import { pushState } from 'redux-router';
import getAvatarByNumber from '../lib/avatar_by_number';
import ImagePicker from '../components/ImagePicker';
import { resizeImage } from '../lib/utils';

export default class UserPhoto extends React.Component {

  componentDidMount() {
    const { user, fallbackOnError } = this.props;
    if (user.avatar) {
      if (fallbackOnError) {
        const image = new Image();
        image.onerror = () => this.setState({avatar: getAvatarByNumber(user.id)});
        image.onload = () => this.setState({avatar: user.avatar});
        image.src = user.avatar;
      } else {
        this.setState({avatar: user.avatar});
      }
    } else {
      this.setState({avatar: getAvatarByNumber(user.id)});
    }
  }

  constructor(props) {
    super(props);
    this.state = {avatar: ''};
  }

  updateAvatar(avatar) {
    const { onChange } = this.props;
    if (onChange) onChange(avatar);
  }

  render() {
    const {
      className,
      user,
      editable,
      addBadge,
      onMouseEnter,
      onMouseLeave,
      customBadgeSize,
      customBadge,
      uploadImage,
      i18n,
      presets
    } = this.props;
    // @xdamman: /!\ this is generating a lot of requests to fetch the avatar because render() is often executed!
    // that's probably why we were using so much bandwidth from cloudinary!
    const width = this.props.width;
    const height = this.props.height || width;
    const avatar = (!this.state.avatar || this.state.avatar.indexOf('/public/') === 0) ? this.state.avatar : resizeImage(this.state.avatar, { width: width * 2, height: height * 2 });
    const styles = {
      backgroundImage: `url(${avatar})`,
      width,
      height
    };

    if (editable) {
      return (
        <ImagePicker
          src={user.avatar}
          className="avatar"
          handleChange={avatar => this.updateAvatar(avatar)}
          uploadImage={uploadImage}
          i18n={i18n}
          presets={presets}
        />
      )
    }

    return (
      <div className={`UserPhoto bg-no-repeat bg-center relative ${user.tier} ${className} ${avatar ? 'UserPhoto--loaded' : ''} `} onClick={() => pushState(null, `/${user.username}`)} onMouseEnter={ onMouseEnter } onMouseLeave={ onMouseLeave }>
          
          <div className='width-100 height-100 bg-contain bg-no-repeat bg-center' style={styles} title={user.name} ></div>
          {addBadge && (
            <div className='UserPhoto-badge absolute bg-white'>
              <svg className='block -green' width={`${customBadgeSize ? customBadgeSize : '14'}`} height={`${customBadgeSize ? customBadgeSize : '14'}`}>
                <use xlinkHref={`#${customBadge ? customBadge : 'svg-isotype'}`}/>
              </svg>
            </div>
          )}
      </div>
    );
  }
}

UserPhoto.propTypes = {
  user: React.PropTypes.object,
  editable: React.PropTypes.bool,
  uploadImage: React.PropTypes.func, // if editable true, we need to pass a function to upload the image
  onChange: React.PropTypes.func,
  i18n: React.PropTypes.object,
  width: React.PropTypes.number,
  height: React.PropTypes.number,
  addBadge: React.PropTypes.bool,
  fallbackOnError: React.PropTypes.bool
};

UserPhoto.defaultProps = {
  addBadge: false,
  fallbackOnError: true
};

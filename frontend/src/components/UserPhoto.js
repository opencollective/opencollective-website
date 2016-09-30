import React from 'react';
import getAvatarByNumber from '../lib/avatar_by_number';
import ImagePicker from '../components/ImagePicker';

const cloudinaryUrl = (url) => {
  return `https://res.cloudinary.com/opencollective/image/fetch/h_128/${encodeURIComponent(url)}`;
};

export default class UserPhoto extends React.Component {

  componentDidMount() {
    const { user } = this.props;
    if (user.avatar) {
      const image = new Image();
      image.onerror = () => this.setState({avatar: getAvatarByNumber(user.id)});
      image.onload = () => this.setState({avatar: user.avatar});
      image.src = user.avatar;
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
    const avatar = (!this.state.avatar || this.state.avatar.indexOf('/static/') === 0) ? this.state.avatar : cloudinaryUrl(this.state.avatar);
    const width = this.props.width;
    const height = this.props.height || width;
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
      <div className={`UserPhoto bg-no-repeat bg-center relative ${user.tier} ${className} ${avatar ? 'UserPhoto--loaded' : ''} `} onMouseEnter={ onMouseEnter } onMouseLeave={ onMouseLeave }>
        <div className='width-100 height-100 bg-contain bg-no-repeat bg-center' style={styles}></div>
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
  width: React.PropTypes.int,
  height: React.PropTypes.int,
  addBadge: React.PropTypes.bool
};

UserPhoto.defaultProps = {
  addBadge: false
};

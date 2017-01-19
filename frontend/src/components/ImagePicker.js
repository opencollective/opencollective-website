import React, { Component, PropTypes } from 'react';
import ImageUpload from './ImageUpload';
import _ from 'lodash';

const REG_VALID_URL = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;
const REG_VALID_TWITTER_USERNAME = /^@?([a-zA-Z0-9_]{1,15})$/;
const PRESET_AVATARS = [
  '/static/images/users/icon-avatar-placeholder.svg',
  '/static/images/users/avatar-02.svg',
  '/static/images/users/avatar-03.svg',
  '/static/images/users/avatar-04.svg',
];
const UPLOAD_AVATAR = '/static/images/users/upload-default.svg';
const UPLOAD_AVATAR_HOVER = '/static/images/users/upload-hover.svg';
const UPLOAD_AVATAR_ACTIVE = '/static/images/users/upload-pressed.svg';
const KNOWN_SOURCES = {
  'facebook': '/static/images/users/facebook-badge.svg',
  'twitter': '/static/images/users/twitter-badge.svg',
  'google': '/static/images/users/google-badge.svg',
  'github': '/static/images/users/github-badge.svg',
  'gravatar': '/static/images/users/gravatar-badge.svg',
  'angelist': '/static/images/users/angelist-badge.svg',
  'aboutme': '/static/images/users/aboutme-badge.svg',
}

export default class ImagePicker extends Component {

  constructor(props) {
    super(props);
    const {
      src,
      presets
    } = this.props;

    this.blacklist = [];
    this.presets = presets || PRESET_AVATARS;
    this.images = [];

    if (src) {
      this.images.push({
        src,
        source: 'default'
      });
    }

    this.images.push({
      source: 'upload',
      src: UPLOAD_AVATAR
    });

    this.presets.map(src => {
      this.images.push({source: 'preset', src});
    });

    this.state = {
      isLoading: false,
      currentIndex: 0,
      twitter: undefined,
      website: undefined
    };

    this.lazyLookupSocialMediaAvatars = _.debounce(this.lookupSocialMediaAvatars.bind(this), 600);
  }

  render() {
    const {
      className='avatar',
      label='Choose a Profile Image',
      i18n
    } = this.props;

    const {
      isLoading,
      currentIndex,
      hover,
      pressed
    } = this.state;

    const { images } = this;
    const currentImage = images[currentIndex];
    const hasMultipleOptions = images.length > 1;
    let currentSrc =  currentImage.src;

    // Update Hover/Press images for upload avatar
    if (hover && currentImage.source === 'upload' &&
      currentImage.src.indexOf('/static') === 0) {
      currentSrc = (pressed) ? UPLOAD_AVATAR_ACTIVE : UPLOAD_AVATAR_HOVER;
    }

    return (
      <div className={`ImagePicker-container ${className}`}>
        <div className="ImagePicker-loader" style={{display : (isLoading ? 'block' : 'none')}}>
          <div className="loader"></div>
        </div>
        <div className="ImagePicker-label">{label}</div>
        {hasMultipleOptions && <div className={`ImagePicker-prev ImagePicker-editControl ${this.prevIsPossible() ? 'active' : ''}`} onClick={this.prev.bind(this)}></div>}
        <div className='ImagePicker-preview' onClick={() => this.avatarClick.call(this, currentImage)} onMouseOver={() => this.setState({'hover': true})} onMouseOut={() => this.setState({'hover': false, pressed: false})} onMouseDown={() => this.setState({'pressed': true})} onMouseUp={() => this.setState({'pressed': false})}>
          <img src={currentSrc} onError={this.onImageError.bind(this)} />
        </div>
        <div className='ImagePicker-source-badge' style={{display : (KNOWN_SOURCES[currentImage.source] ? 'block' : 'none')}}>
          <img src={KNOWN_SOURCES[currentImage.source]}/>
        </div>
        {hasMultipleOptions && <div className={`ImagePicker-next ImagePicker-editControl ${this.nextIsPossible() ? 'active' : ''}`} onClick={this.next.bind(this)}></div>}
        <ul className='ImagePicker-dot-list ImagePicker-editControl'>
          {hasMultipleOptions && images.map(
            avatar => {
              return <li key={avatar.source + avatar.src} onClick={() => this.select.call(this, avatar)} className={avatar === images[currentIndex] ? 'selected' : ''}></li>;
            }
          )}
        </ul>
        <div className="ImageUpload-container">
          <ImageUpload ref="ImageUpload" uploadImage={this.props.uploadImage} onUploading={this.onUploading.bind(this)} onFinished={this.onUploadFinished.bind(this)} i18n={i18n} />
        </div>
      </div>
    );
  }

  componentWillReceiveProps(nextProps) {
    const {website, twitter} = nextProps;

    if (this.props.dontLookupSocialMediaAvatars) return;

    if (website !== this.state.website || twitter !== this.state.twitter) {
      const nextStateWebsite = REG_VALID_URL.test(website) ? website : undefined;
      const nextStateTwitter = twitter && REG_VALID_TWITTER_USERNAME.test(twitter) ? REG_VALID_TWITTER_USERNAME.exec(twitter)[1] : undefined;

      if (nextStateWebsite !== this.state.website || nextStateTwitter !== this.state.twitter) {
        this.state.twitter = nextStateTwitter;
        this.state.website = nextStateWebsite;
        if (this.state.twitter || this.state.website) {
          this.lazyLookupSocialMediaAvatars(this.state.website, this.state.twitter);
        }
      }
    }
  }

  onImageError() {
    const currentImage = this.images[this.state.currentIndex];
    if (this.blacklist.indexOf(currentImage.src) === -1) {
      this.blacklist.push(currentImage.src);
    }

    this.images.splice(this.state.currentIndex, 1);

    if (!this.images[this.state.currentIndex]) {
      this.setState({currentIndex: 0}, this.thereWasAChange);
    } else {
      this.forceUpdate(this.thereWasAChange);
    }
  }

  thereWasAChange() {
    const currentImage = this.images[this.state.currentIndex];
    if (currentImage.src !== UPLOAD_AVATAR)
      this.props.handleChange(currentImage.src);
  }

  nextIsPossible() {
    return this.state.currentIndex < this.images.length - 1;
  }

  prevIsPossible() {
    return this.state.currentIndex > 0;
  }

  select(option) {
    if (this.state.isLoading) return;
    this.setState({currentIndex: this.images.indexOf(option)}, this.thereWasAChange);
  }

  next() {
    if (this.state.isLoading) return;
    if (this.nextIsPossible()) {
      this.setState({currentIndex: this.state.currentIndex + 1}, this.thereWasAChange);
    }
  }

  prev() {
    if (this.state.isLoading) return;
    if (this.prevIsPossible()) {
      this.setState({currentIndex: this.state.currentIndex - 1}, this.thereWasAChange);
    }
  }

  avatarClick(option) {
    if (option.source === 'preset' || option.source === 'upload') {
      this.refs.ImageUpload.clickInput();
    }
  }

  onUploading() {
    this.setState({isLoading: true});
  }

  onUploadFinished(result) {
    this.setState({isLoading: false});
    if (result) {
      const uploadOption = this.images.reduce((prev, curr) => prev.source === 'upload' ? prev : curr);
      uploadOption.src = result.url;
      this.setState({currentIndex: this.images.indexOf(uploadOption)});
      this.thereWasAChange();
    }
  }

  lookupSocialMediaAvatars(website, twitter) {

    if (!website && !twitter) return;

    const {
      profileForm,
      newUser,
      getSocialMediaAvatars,
      uploadOptionFirst
    } = this.props;

    if (!getSocialMediaAvatars) return console.error("lookupSocialMediaAvatars> getSocialMediaAvatars action no available");
    if (!website && !twitter) return console.error("lookupSocialMediaAvatars> no website or twitter handle to lookup", website, twitter);
    if (!newUser.id) return console.error("lookupSocialMediaAvatars> no user id");

    const defaultPresetIndex = uploadOptionFirst ? 1 : 0;
    if (!this.state.isLoading) {
      this.setState({isLoading: true});
    }

    getSocialMediaAvatars(newUser.id, {website, twitterHandle: twitter, name: profileForm.name})
    .then((response) => {
      const currentImage = this.images[this.state.currentIndex];
      const results = response.json.filter((option) => this.blacklist.indexOf(option.src) === -1 );
      const newResults = results.filter((option) => {
        let alreadyExists = false;
        this.images.forEach((opt) => {
          if (opt.src === option.src) {
            alreadyExists = true;
          }
        })
        return !alreadyExists
      });
      let isFirstTime = false;

      newResults.forEach(result => {
        const existingOption = this.images.filter((option) => {
          return option.source === result.source
        })[0];
        if (existingOption) {
          existingOption.src = result.src;
        } else {
          if (this.images[defaultPresetIndex].source === 'preset') {
            if (defaultPresetIndex) {
              this.images.splice(defaultPresetIndex, 1);
              this.images.splice(0, 0, result);
            } else {
              this.images[defaultPresetIndex].source = result.source;
              this.images[defaultPresetIndex].src = result.src;
            }
            isFirstTime = true;
          } else {
            this.images.splice(0, 0, result);
          }
        }
      });

      this.setState({currentIndex: isFirstTime ? 0 : this.images.indexOf(currentImage), isLoading: false}, this.thereWasAChange);
    })
    .catch((error) => {
      console.error(error);
      this.setState({isLoading: false});
    })
  }
}

ImagePicker.propTypes = {
  i18n: PropTypes.object.isRequired,
  src: PropTypes.string
};
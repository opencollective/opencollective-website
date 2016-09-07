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
    this.blacklist = [];
    this.presets = this.props.presets || PRESET_AVATARS;
    this.options = this.presets.map(src => {
      return {source: 'preset', src};
    });

    if (props.src) {
      this.options[0].src = props.src;
      this.options[0].source = 'default';
    }

    this.options[props.uploadOptionFirst ? 'unshift' : 'push']({
      source: 'upload',
      src: UPLOAD_AVATAR
    });

    this.state = {
      isLoading: false,
      currentIndex: 0,
      twitter: '',
      website: ''
    };

    this.lazyLookupSocialMediaAvatars = _.debounce(this.lookupSocialMediaAvatars.bind(this), 600);
  }

  render() {
    const {className='avatar', label='Choose a Profile Image'} = this.props;
    const {isLoading, currentIndex, hover, pressed} = this.state;
    const { options } = this;
    const currentOption = options[currentIndex];
    const hasMultipleOptions = options.length > 1;
    let currentSrc =  currentOption.src;

    // Update Hover/Press images for upload option
    if (hover && currentOption.source === 'upload' &&
      currentOption.src.indexOf('/static') === 0) {
      currentSrc = (pressed) ? UPLOAD_AVATAR_ACTIVE : UPLOAD_AVATAR_HOVER;
    }

    return (
      <div className={`ImagePicker-container ${className}`}>
        <div className="ImagePicker-loader" style={{display : (isLoading ? 'block' : 'none')}}>
          <div className="loader"></div>
        </div>
        <div className="ImagePicker-label">{label}</div>
        {hasMultipleOptions && <div className={this.prevIsPossible() ? 'ImagePicker-prev active' : 'ImagePicker-prev'} onClick={this.prev.bind(this)}></div>}
        <div className='ImagePicker-preview' onClick={() => this.avatarClick.call(this, currentOption)} onMouseOver={() => this.setState({'hover': true})} onMouseOut={() => this.setState({'hover': false, pressed: false})} onMouseDown={() => this.setState({'pressed': true})} onMouseUp={() => this.setState({'pressed': false})}>
          <img src={currentSrc} onError={this.onImageError.bind(this)} />
        </div>
        <div className='ImagePicker-source-badge' style={{display : (KNOWN_SOURCES[currentOption.source] ? 'block' : 'none')}}>
          <img src={KNOWN_SOURCES[currentOption.source]}/>
        </div>
        {hasMultipleOptions && <div className={this.nextIsPossible() ? 'ImagePicker-next active' : 'ImagePicker-next'} onClick={this.next.bind(this)}></div>}
        <ul className='ImagePicker-dot-list'>
          {hasMultipleOptions && options.map(
            option => {
              return <li key={option.source + option.src} onClick={() => this.select.call(this, option)} className={option === options[currentIndex] ? 'selected' : ''}></li>;
            }
          )}
        </ul>
        <div className="ImageUpload-container">
          <ImageUpload ref="ImageUpload" isUploading={false} onFinished={this.onUploadFinished.bind(this)} {...this.props} />
        </div>
      </div>
    );
  }

  componentWillReceiveProps(nextProps) {
    const {website, twitter} = nextProps;

    if (this.props.dontLookupSocialMediaAvatars) return;

    if (website !== this.state.website || twitter !== this.state.twitter) {
      const nextStateWebsite = REG_VALID_URL.test(website) ? website : '';
      const nextStateTwitter = REG_VALID_TWITTER_USERNAME.test(twitter) ? REG_VALID_TWITTER_USERNAME.exec(twitter)[1] : '';

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
    const currentOption = this.options[this.state.currentIndex];
    if (this.blacklist.indexOf(currentOption.src) === -1) {
      this.blacklist.push(currentOption.src);
    }

    this.options.splice(this.state.currentIndex, 1);

    if (!this.options[this.state.currentIndex]) {
      this.setState({currentIndex: 0}, this.thereWasAChange);
    } else {
      this.forceUpdate(this.thereWasAChange);
    }
  }

  thereWasAChange() {
    const currentOption = this.options[this.state.currentIndex];
    this.props.handleChange(currentOption.src !== UPLOAD_AVATAR ? currentOption.src : this.presets[0]);
  }

  nextIsPossible() {
    return this.state.currentIndex < this.options.length - 1;
  }

  prevIsPossible() {
    return this.state.currentIndex > 0;
  }

  select(option) {
    if (this.state.isLoading) return;
    this.setState({currentIndex: this.options.indexOf(option)}, this.thereWasAChange);
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

  onUploadFinished(result) {
    if (result) {
      const uploadOption = this.options.reduce((prev, curr) => prev.source === 'upload' ? prev : curr);
      uploadOption.src = result.url;
      this.setState({currentIndex: this.options.indexOf(uploadOption)});
      this.thereWasAChange();
    }
  }

  lookupSocialMediaAvatars(website, twitter) {
    const { profileForm, newUser, getSocialMediaAvatars, uploadOptionFirst } = this.props;
    const defaultPresetIndex = uploadOptionFirst ? 1 : 0;

    if (!this.state.isLoading) {
      this.setState({isLoading: true});
    }

    getSocialMediaAvatars(newUser.id, {website, twitterHandle: twitter, name: profileForm.name})
    .then((response) => {
      const currentOption = this.options[this.state.currentIndex];
      const results = response.json.filter((option) => this.blacklist.indexOf(option.src) === -1 );
      const newResults = results.filter((option) => {
        let alreadyExists = false;
        this.options.forEach((opt) => {
          if (opt.src === option.src) {
            alreadyExists = true;
          }
        })
        return !alreadyExists
      });
      let isFirstTime = false;

      newResults.forEach(result => {
        const existingOption = this.options.filter((option) => {
          return option.source === result.source
        })[0];
        if (existingOption) {
          existingOption.src = result.src;
        } else {
          if (this.options[defaultPresetIndex].source === 'preset') {
            if (defaultPresetIndex) {
              this.options.splice(defaultPresetIndex, 1);
              this.options.splice(0, 0, result);
            } else {
              this.options[defaultPresetIndex].source = result.source;
              this.options[defaultPresetIndex].src = result.src;
            }
            isFirstTime = true;
          } else {
            this.options.splice(0, 0, result);
          }
        }
      });

      this.setState({currentIndex: isFirstTime ? 0 : this.options.indexOf(currentOption), isLoading: false}, this.thereWasAChange);
    })
    .catch((error) => {
      console.error(error);
      this.setState({isLoading: false});
    })
  }
}

ImagePicker.propTypes = {
  i18n: PropTypes.func.isRequired
};
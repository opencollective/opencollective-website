import React, { Component, PropTypes } from 'react';
import ImageUpload from './ImageUpload';

const REG_VALID_URL = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;
const REG_VALID_TWITTER_USERNAME = /^[a-zA-Z0-9_]{1,15}$/;
const PRESET_AVATARS = [
  '/static/images/users/icon-avatar-placeholder.svg',
  '/static/images/users/avatar-02.svg',
  '/static/images/users/avatar-03.svg',
];
const KNOWN_SOURCES = {
  'facebook': '/static/images/users/facebook-badge.svg',
  'twitter': '/static/images/users/twitter-badge.svg',
  'google': '/static/images/users/google-badge.svg',
}

export default class ImagePicker extends Component {

  constructor(props) {
    super(props);
    this.options = PRESET_AVATARS.map(src => {return {source: 'preset', src: src}});

    if (props.src)
    {
      this.options[0].src = props.src;
      this.options[0].source = 'default';
    }

    this.options.push({
      source: 'upload',
      src: '/static/images/users/upload-default.svg'
    });

    this.state = {
      isLoading: false,
      currentIndex: 0,
      twitter: '',
      website: '',
      className: props.className || 'avatar'
    };
  }

  render() {
    const {isLoading, currentIndex, website, twitter, className} = this.state;
    const options = this.options;
    const currentOption = options[currentIndex];

    return (
      <div className={'ImagePicker-container ' + className}>
        <div className="ImagePicker-loader" style={{display : (isLoading ? 'block' : 'none')}}>
          <div className="loader"></div>
        </div>
        <div className="ImagePicker-label">Choose a Profile Image</div>
        <div className={this.prevIsPossible() ? 'ImagePicker-prev active' : 'ImagePicker-prev'} onClick={this.prev.bind(this)}></div>
        <div className='ImagePicker-preview' onClick={event => this.avatarClick.call(this, currentOption)}>
          <img src={currentOption.src} width="64px" height="64px"/>
        </div>
        <div className='ImagePicker-source-badge' style={{display : (KNOWN_SOURCES[currentOption.source] ? 'block' : 'none')}}>
          <img src={KNOWN_SOURCES[currentOption.source]}/>
        </div>
        <div className={this.nextIsPossible() ? 'ImagePicker-next active' : 'ImagePicker-next'} onClick={this.next.bind(this)}></div>
        <ul className='ImagePicker-dot-list'>
          {options.map(
            option => {
              return <li key={option.source + option.src} onClick={event => this.select.call(this, option, event.target)} className={option === options[currentIndex] ? 'selected' : ''}></li>;
            }
          )}
        </ul>
        <div className="ImageUpload-container hidden">
          <ImageUpload ref="ImageUpload" isUploading={false} onFinished={this.onUploadFinished.bind(this)} {...this.props} />
        </div>
      </div>
    );
  }

  componentWillReceiveProps(nextProps) {
    let {website, twitter} = nextProps;
    this.state.twitter = REG_VALID_TWITTER_USERNAME.test(twitter) ? twitter : '';
    this.state.website = REG_VALID_URL.test(website) ? website : '';

    if (this.state.twitter || this.state.website)
    {
      this.setState({isLoading: true});
      this.getSocialMediaAvatars(this.state.website, this.state.twitter)
      .then(results => {
        results.forEach(result => {
          let existingOption = this.options.filter((option) => {return option.source === result.source})[0];
          if (existingOption)
          {
            existingOption.src = result.src;
          }
          else
          {
            if (this.options[0].source === 'preset')
            {
              this.options[0].source = result.source;
              this.options[0].src = result.src;
              this.setState({currentIndex: 0});
            }
            else
            {
              this.options.splice(1, 0, result)
              this.setState({currentIndex: 1});
            }
          }
        });

        this.setState({isLoading: false});
      })
      .catch(reason => {
        this.setState({isLoading: true});
        console.error('api error:' + reason);
      });
    }
  }

  nextIsPossible()
  {
    return this.state.currentIndex < this.options.length - 1;
  }

  prevIsPossible()
  {
    return this.state.currentIndex > 0;
  }

  select(option, element)
  {
    if (this.state.isLoading) return;
    this.setState({currentIndex: this.options.indexOf(option)});
  }

  next()
  {
    if (this.state.isLoading) return;
    if (this.nextIsPossible())
    {
      this.setState({currentIndex: this.state.currentIndex + 1});
    }
  }

  prev()
  {
    if (this.state.isLoading) return;
    if (this.prevIsPossible())
    {
      this.setState({currentIndex: this.state.currentIndex - 1});
    }
  }

  avatarClick(option)
  {
    if (option.source === 'preset' || option.source === 'upload')
    {
      this.refs.ImageUpload.clickInput();
    }
  }

  onUploadFinished(url)
  {
    if (url)
    {
      const uploadItem = this.options.reduce((prev, curr) => prev.source === 'upload' ? prev : curr);
      uploadItem.src = url;
    }
    else
    {
      // 401, could be 500, even the user canceling or closing file dialog..
      // As of now  ImageUpload component does not signal why there was no url after
      // the upload finished - TODO
    }
  }

  getSocialMediaAvatars(website, twitter)
  {
    let SAMPLE_API_RETURN = []; // TODO - server side
    if (twitter) SAMPLE_API_RETURN.push({source: 'twitter', src: 'https://avatars2.githubusercontent.com/u/2263170?v=3&s=64'});
    if (website) SAMPLE_API_RETURN.push({source: 'facebook', src: 'https://avatars2.githubusercontent.com/u/2263170?v=3&s=64'});
    
    return new Promise(
      (resolve, reject) => {
        setTimeout(() => resolve(SAMPLE_API_RETURN), ~~(Math.random() * 1000));
      }
    );
  }
}

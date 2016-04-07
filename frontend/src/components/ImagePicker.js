import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import ImageUpload from './ImageUpload';

export default class ImagePicker extends Component {

  constructor(props) {
    super(props);
    this.list = [
      {
        id: 0,
        source: 'placeholder',
        src: '/static/images/users/icon-avatar-placeholder.svg'
      },
      {
        id: 1,
        source: 'preset',
        src: '/static/images/users/avatar-02.svg',
      },
      {
        id: 2,
        source: 'preset',
        src: '/static/images/users/avatar-03.svg',
      },
      {
        id: 3,
        source: 'upload',
        src: '/static/images/users/upload-default.svg',
      },
    ];

    this.state = {isLoading: false, showImageUpload: false, currentIndex: 0};
  }

  render() {
    const list = this.list;
    const {isLoading, showImageUpload, currentIndex} = this.state;
    const currentItem = list.reduce((prev, curr) => prev.id === currentIndex ? prev : curr);

    return (
      <div className='ImagePicker-container'>
        <div className="ImagePicker-loader" style={{display : (isLoading ? 'block' : 'none')}}>
          <div className="loader"></div>
        </div>
        <div className="ImagePicker-label">Choose a Profile Image</div>
        <div className={this.prevIsPossible() ? 'ImagePicker-prev active' : 'ImagePicker-prev'} onClick={this.prev.bind(this)}></div>
        <div className='ImagePicker-preview' onClick={event => this.avatarClick.call(this, currentItem)}>
          <img src={currentItem.src} width="64px" height="64px"/>
        </div>
        <div className="ImagePicker-source-badge"></div>
        <div className={this.nextIsPossible() ? 'ImagePicker-next active' : 'ImagePicker-next'} onClick={this.next.bind(this)}></div>
        <ul className='ImagePicker-dot-list'>
          {list.map(
            item => {
              return <li key={item.id} onClick={event => this.select.call(this, item, event.target)} className={item.id == currentIndex ? 'selected' : ''}></li>;
            }
          )}
        </ul>
        <ImageUpload className={showImageUpload ? '' : 'hidden'}/>
      </div>
    );
  }

  // componentDidMount() {setTimeout(function(){console.clear()}, 300)}

  nextIsPossible()
  {
    return this.state.currentIndex < this.list.length - 1;
  }

  prevIsPossible()
  {
    return this.state.currentIndex > 0;
  }

  select(item, element)
  {
    if (this.state.isLoading) return;
    this.setState({currentIndex: item.id});
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

  avatarClick(item)
  {
    if (item.source === 'placeholder' || item.source === 'preset' || item.source === 'upload')
    {
      this.setState({showImageUpload: true});
    }
  }
}

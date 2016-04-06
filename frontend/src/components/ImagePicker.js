import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';

export default class ImageUpload extends Component {

  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const list = [{index: 1}, {index: 2}, {index: 3}];
    return (
      <div className='ImagePicker-container'>
        <div className='ImagePicker-preview'></div>
        <ul className='ImagePicker-dot-list'>
          {list.map(element => {return <li onClick={this.select.bind(element)}></li>;})}
        </ul>
      </div>
    );
  }

  select()
  {
    
  }
}

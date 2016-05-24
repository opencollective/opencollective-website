import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
export class Profile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      step: 0
    };
  }

  render() {
  	return (
  		<div className='Profile'>
  			Profile
  		</div>
  	)
  }
}
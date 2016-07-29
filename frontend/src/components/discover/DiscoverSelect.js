import React, { Component, PropTypes } from 'react';

export default class DiscoverSelect extends Component {

  static propTypes = {}

  constructor(props) {
    super(props);
    this.state = {}
  }

  render() {
    const { label, values } = this.props;
    const current = 'all'
    return (
      <div className='DiscoverSelect'>
        <div className='DiscoverSelect-label'>{ label }</div>
        <div className='DiscoverSelect-selected'>
          <span>{ current }</span>
          <span className='arrow--bottom'></span>
        </div>

      </div>
    )
  }
}
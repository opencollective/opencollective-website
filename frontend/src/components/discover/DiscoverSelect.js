import React, { Component, PropTypes } from 'react';

const nbsp = '\xA0'; // non-breaking space: &nbsp;


export default class DiscoverSelect extends Component {

  static propTypes = {}

  constructor(props) {
    super(props);
    this.state = {
      opened: false
    }
  }

  render() {
    const { label, options, currentOption, onSelect } = this.props;
    const { opened } = this.state;
    const current = currentOption || '--'
    return (
      <div className='DiscoverSelect'>
        <div className='DiscoverSelect-label'>{ label }</div>
        <div className='DiscoverSelect-selected' onClick={() => this.setState({opened: !this.state.opened})}>
          <span>{ currentOption }</span>
          <span className='arrow--bottom'></span>
        </div>
        {opened ? (
          <div className='DiscoverSelect-menu'>
            <ul>
              {options && options.map(option => <li onClick={() => {this.setState({opened: false}); onSelect(option)} } >{ option.replace(/\s+/g, nbsp) }</li>)}
            </ul>
          </div>
        ) : null}
      </div>
    )
  }
}
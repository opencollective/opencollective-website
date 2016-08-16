import React, { Component, PropTypes } from 'react';

const nbsp = '\xA0'; // non-breaking space: &nbsp;

export default class DiscoverSelect extends Component {

  static propTypes = {
    label: PropTypes.string,
    options: PropTypes.arrayOf(React.PropTypes.string),
    currentOption: PropTypes.string,
    onSelect: PropTypes.func.isRequired
  }

  static defaultProps = {
    currentOption: ''
  }

  constructor(props) {
    super(props);
    this.state = {
      opened: false
    }
    this.onClick = this.onClick.bind(this);
    this.onClickOutsideRef = this.onClickOutside.bind(this);
  }

  render() {
    const { label, options, currentOption } = this.props;
    const { opened } = this.state;
    return (
      <div className='DiscoverSelect'>
        <div className='DiscoverSelect-label'>{ label }</div>
        <div className='DiscoverSelect-selected' onClick={this.onClick}>
          <span>{ currentOption }</span>
          <span className='arrow--bottom'></span>
        </div>
        {opened ? (
          <div className='DiscoverSelect-menu' onClick={e => e.nativeEvent.stopImmediatePropagation()}>
            <ul>
              {options && options.map(option => <li onClick={this.onMenuItemClickMiddleware(option)}>{ option.replace(/\s+/g, nbsp) }</li>)}
            </ul>
          </div>
        ) : null}
      </div>
    )
  }

  componentDidMount() {
    document.addEventListener('click', this.onClickOutsideRef);
  }

  componentWillUnmount() {
    document.removeEventListener('click', this.onClickOutsideRef);
  }

  onClick(e) {
    this.setState({opened: !this.state.opened});
    e.nativeEvent.stopImmediatePropagation();
  }

  onClickOutside() {
    this.setState({opened: false});
  }

  onMenuItemClickMiddleware(option) {
    const { onSelect } = this.props;
    return () => {
      onSelect(option);
      this.setState({opened: false});
    }
  }
}
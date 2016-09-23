import React, { Component, PropTypes } from 'react';

export default class CustomInput extends Component {

  static propTypes = {
    className: PropTypes.string,
    disabled: PropTypes.bool,
    maxLength: PropTypes.number,
    name: PropTypes.string,
    onChange: PropTypes.func,
    placeholder: PropTypes.string,
    value: PropTypes.string,
  }

  static defaultProps = {
    className: '',
    disabled: false,
    placeholder: '',
    value: '',
  }

  constructor(props) {
    super(props);
    this.onPlaceholderClickRef = this.onPlaceholderClick.bind(this)
  }

  render() {
    const { disabled, onChange, className, placeholder, value, maxLength, name, style } = this.props;
    return (
      <div className={`CustomInput ${className} ${disabled ? 'CustomInput--disabled' : ''}`}>
        {!value && (
          <div className='CustomInput-placeholder' onClick={this.onPlaceholderClickRef}>{placeholder}</div>
        )}
        <input
          ref='input'
          className='CustomInput-input'
          maxLength={maxLength}
          value={value}
          style={style}
          name={name}
          onChange={e => onChange(e.target.value) } />
        {maxLength && (
          <div className='CustomInput-counter'>{maxLength - value.length}</div>
        )}
      </div>
    )
  }

  onPlaceholderClick() {
    this.refs.input.focus();
  }
}
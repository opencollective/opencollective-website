import React, { Component, PropTypes } from 'react';

export default class CustomSelect extends Component {

  static propTypes = {
    className: PropTypes.string,
    disabled: PropTypes.bool,
    name: PropTypes.string,
    onChange: PropTypes.func,
    value: PropTypes.string,
  }

  static defaultProps = {
    className: '',
    disabled: false,
    value: '',
  }

  constructor(props) {
    super(props);
  }

  render() {
    const { children, disabled, onChange, className, value, name } = this.props;
    return (
      <div className={`CustomSelect ${className} ${disabled ? 'CustomSelect--disabled' : ''}`}>
        <select
          name={name}
          className='CustomSelect-select'
          disabled={disabled}
          value={value}
          onChange={e => onChange(e.target.value)}>
          {children}
        </select>
        <div className='CustomSelect-arrow'></div>
      </div>
    )
  }
}

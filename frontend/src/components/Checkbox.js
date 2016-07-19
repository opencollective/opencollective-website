import React, { Component, PropTypes } from 'react';

export default class Checkbox extends Component {

  static propTypes = {
    checked: PropTypes.bool,
    checkmark: PropTypes.string,
    className: PropTypes.string,
    disabled: PropTypes.bool,
    onChange: PropTypes.func
  }

  static defaultProps = {
    checked: false,
    checkmark: '\u2714',
    className: '',
    disabled: false
  }

  constructor(props) {
    super(props);
  }

  render() {
    const { disabled, checked, className, checkmark } = this.props;
    return (
      <div className={`Checkbox ${className} ${disabled ? 'Checkbox--disabled' : ''}`} onClick={!disabled && this.onClick.bind(this)}>
        {checked && <small className="Checkbox-checkmark">{checkmark}</small>}
      </div>
    )
  }

  onClick() {
    const { checked, onChange } = this.props;
    onChange(!checked);
  }
}

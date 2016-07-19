import React, { Component, PropTypes } from 'react';

export default class CustomTextArea extends Component {

  static propTypes = {
    className: PropTypes.string,
    cols: PropTypes.number,
    disabled: PropTypes.bool,
    maxLength: PropTypes.number,
    onChange: PropTypes.func,
    placeholder: PropTypes.string,
    resize: PropTypes.oneOf(['none', 'both', 'veritcal', 'horizontal']),
    rows: PropTypes.number,
    value: PropTypes.string,
    name: PropTypes.string
  }

  static defaultProps = {
    className: '',
    disabled: false,
    placeholder: '',
    resize: 'none',
    value: ''
  }

  constructor(props) {
    super(props);
    this.state = {
      hasScrollbar: false
    }
  }

  render() {
    const { disabled, onChange, className, placeholder, value, maxLength, rows, cols, resize, name } = this.props;
    const { hasScrollbar } = this.state;
    return (
      <div className={`CustomTextArea ${className} ${disabled ? 'CustomTextArea--disabled' : ''} ${hasScrollbar ? 'CustomTextArea-has-scrollbar' : ''}`}>
      {!value && <div className="CustomTextArea-placeholder" onClick={this.onPlaceholderClick.bind(this)}>{placeholder}</div>}
      <textarea
        name={name}
        ref='textarea'
        className='CustomTextArea-textarea'
        maxLength={maxLength}
        value={value}
        rows={rows}
        cols={cols}
        style={{
          width: cols ? 'auto' : null,
          height: rows ? 'auto' : null,
          resize: resize
        }}
        onChange={(e) => onChange(e.target.value) }
        onKeyUp={this.detectScrollbar.bind(this)}
      />
      {maxLength && <div className='CustomTextArea-counter'>{maxLength - value.length}</div>}
      </div>
    )
  }

  onPlaceholderClick() {
    this.refs.textarea.focus();
  }

  detectScrollbar() {
    const element = this.refs.textarea;
    this.setState({hasScrollbar: element.clientHeight < element.scrollHeight})
  }
}

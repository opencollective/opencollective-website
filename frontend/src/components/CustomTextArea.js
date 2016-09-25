import React, { Component, PropTypes } from 'react';

export default class CustomTextArea extends Component {

  constructor(props) {
    super(props);
    this.state = {
      hasScrollbar: false
    }
  }

  render() {
    const { disabled, onBlur = () => {}, onChange, className, placeholder, prepend, value, maxLength, rows, cols, resize, name } = this.props;
    const { hasScrollbar } = this.state;
    return (
      <div className={`CustomTextArea ${className} ${disabled ? 'CustomTextArea--disabled' : ''} ${hasScrollbar ? 'CustomTextArea-has-scrollbar' : ''}`}>
      {prepend && <span className="CustomTextArea-prepend">{prepend}</span> }
      <div className='CustomTextArea-field'>
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
            resize
          }}
          onChange={(e) => onChange(e.target.value) }
          onBlur={(e) => onBlur(e.target.value)}
          onKeyUp={this.detectScrollbar.bind(this)}
        />
        {maxLength && <div className='CustomTextArea-counter'>{maxLength - value.length}</div>}
        </div>
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

CustomTextArea.propTypes = {
  className: PropTypes.string,
  prepend: PropTypes.string,
  cols: PropTypes.number,
  disabled: PropTypes.bool,
  maxLength: PropTypes.number,
  onChange: PropTypes.func,
  placeholder: PropTypes.string,
  resize: PropTypes.oneOf(['none', 'both', 'vertical', 'horizontal']),
  rows: PropTypes.number,
  value: PropTypes.string,
  name: PropTypes.string
}

CustomTextArea.defaultProps = {
  className: '',
  disabled: false,
  placeholder: '',
  resize: 'none',
  value: ''
}
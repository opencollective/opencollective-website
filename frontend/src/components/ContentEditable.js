import React from 'react';
import debounce from 'lodash/debounce';

// Taken from `react-contenteditable` module

export default class ContentEditable extends React.Component {
  constructor(props) {
    super();
    this.debouncedEmitChange = debounce(this.emitChange.bind(this), 500);
    this.lastHtml = props.html;
  }

  render() {
    const { disabled, className, tagName, ...props } = this.props;

    const html = this.props.html || '';

    return React.createElement(
      tagName || 'div',
      {
        ...props,
        className: `ContentEditable ${!disabled ? 'ContentEditable--enabled' : ''} ${className}`,
        ref: (e) => this.htmlEl = e,
        onInput: this.debouncedEmitChange,
        onBlur: this.props.onBlur || this.emitChange,
        onKeyPress: (e) => {
          if (!this.props.multiline && e.which === 13) {
            e.preventDefault();
            return false;
          }
        },
        contentEditable: !disabled,
        dangerouslySetInnerHTML: {__html: html.replace(/\n|<br>|<\/?div>/g,'')}
      },
      this.props.children);
  }

  shouldComponentUpdate(nextProps) {
    // We need not rerender if the change of props simply reflects the user's
    // edits. Rerendering in this case would make the cursor/caret jump.
    return (
      // Rerender if there is no element yet... (somehow?)
      !this.htmlEl
      // ...or if html really changed... (programmatically, not by user edit)
      || ( nextProps.html !== this.htmlEl.innerHTML
        && nextProps.html !== this.props.html )
      // ...or if editing is enabled or disabled.
      || this.props.disabled !== nextProps.disabled
    );
  }

  componentDidUpdate() {
    const {
      html = ''
    } = this.props;

    if ( this.htmlEl && html !== this.htmlEl.innerHTML ) {
      // Perhaps React (whose VDOM gets outdated because we often prevent
      // rerendering) did not update the DOM. So we update it manually now.
      this.htmlEl.innerHTML = html.replace(/\n|<br>|<\/?div>/g,'');
    }
  }

  emitChange(evt) {
    if (!this.htmlEl) return;
    const html = this.htmlEl.innerHTML;
    if (this.props.onChange && html !== this.lastHtml) {
      evt.target = { value: html };
      this.props.onChange(evt);
    }
    this.lastHtml = html;
  }
}
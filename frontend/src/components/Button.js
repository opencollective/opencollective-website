import React, { Component, PropTypes } from 'react';
import classNames from 'classnames';

export class Button extends Component { 

  render() {
    const {id, label, color, inProgress, onClick, className} = this.props;
    const buttonClassName = classNames({
      'Button': true,
      'Button--submit': true,
      [`Button--${color}`]: !!color,
      'Button--inProgress': inProgress,
    });

    return (
      <span className={className}>
        <button
          id={id}
          onClick={onClick}
          className={buttonClassName}>
          {label}
        </button>
      </span>
    );
  }
}

Button.propTypes = {
  id: PropTypes.string,
  label: PropTypes.string,
  color: PropTypes.string,
  inProgress: PropTypes.boolean,
  onClick: PropTypes.func,
  className: PropTypes.object
}

export default Button;
import React, { PropTypes } from 'react';

const Column = ({ children, className, border, span, style, auto, size }) => {
  // Column-[size]-span
  const spanClassName = span ? `Column-${ size ? `${ size }-${ span }` : span}` : '';
  return (
    <div className={`Column ${ border ? 'Grid--border' : ''} ${ spanClassName } ${ auto ? 'Grid-flex-auto' : ''} ${ className }`} style={style}>
      { children }
    </div>
  )
};

const Grid = ({ children, className, flex, border, style }) => (
  <div className={`Grid ${ flex ? 'Grid--flex' : '' } ${ border ? 'Grid--border' : ''} ${ className }`} style={style}>
    { children }
  </div>
);

Column.propTypes = {
  auto: PropTypes.bool,
  border: PropTypes.bool,
  className: PropTypes.string,
  span: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

Column.defaultProps = {
  className: '',
};

Grid.propTypes = {
  border: PropTypes.bool,
  className: PropTypes.string,
  flex: PropTypes.bool,
};

Grid.defaultProps = {
  className: '',
};

export { Grid as default, Column };

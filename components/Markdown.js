import React, { PropTypes } from 'react';
import marked from 'marked';

const rawMarkup = (text) => {
  var rawMarkup = (text) ? marked(text, {sanitize: true}) : '';
  return { __html: rawMarkup };
}

const Markdown = ({value='', className=''}) => {

  return (
    <div className={className} dangerouslySetInnerHTML={rawMarkup(value)} />
  );
  
}

Markdown.propTypes = {
  value: PropTypes.string.isRequired
};

Markdown.defaultProps = {
  value: ''
};

export default Markdown;

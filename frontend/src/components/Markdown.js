import React, { PropTypes, Component } from 'react';
import marked from 'marked';
import CustomTextArea from './CustomTextArea';
import processMarkdown from '../lib/process_markdown';
import { formatAnchor } from '../lib/utils';

export default class Markdown extends Component {
  constructor(props) {
    super(props);
    this.onClick = this.onClick.bind(this);
    this.onBlur = this.onBlur.bind(this);
    this.state = {
      editMode: false
    };

    const { sections } = processMarkdown(this.props.value);
    this.sections_array = [];
    for (const title in sections) {
      const section = sections[title];
      this.sections_array.push({title, markdown:`${title !== 'intro' ? `# ${title}` : ''}\n\n${section}`});
    }
  }

  render() {
    const {
      value,
      className,
      onChange,
      i18n
    } = this.props;

    if (!this.state.editMode) {

      // we split it into multiple sections
      return (
        <div>
          { this.sections_array.map(section =>
            <div
              className={`${className} section`}
              id={formatAnchor(section.title)}
              dangerouslySetInnerHTML={ this.rawMarkup(section.markdown)}
              onClick={ this.onClick } />)
          }
        </div>);
    } else {
      return (
        <CustomTextArea
          ref='markdownCustomTextArea'
          rows={ (value.length/60 + (value.match(/\n/g) || []).length) || 4 }
          resize='vertical'
          customClass='ContentEditable-long-description'
          value={ value }
          placeholder={ i18n.getString('defaultLongDescription') }
          onChange={ onChange }
          onBlur = { this.onBlur }
          setFocus = { true } />
        )
    }
  }

  rawMarkup(text) {
    const rawMarkup = (text) ? marked(text, {sanitize: true}) : '';
    return { __html: rawMarkup };
  }

  onClick() {
    if (this.props.canEdit && !this.state.editMode) {
      this.setState({ editMode: true });
    }
  }

  onBlur() {
    if (this.state.editMode) {
      this.setState({ editMode: false });
    }
  }
}

Markdown.propTypes = {
  value: PropTypes.string.isRequired,
  className: PropTypes.string,
  canEdit: PropTypes.boolean
};

Markdown.defaultProps = {
  value: '',
  className: '',
  canEdit: false,
  onChange: () => {}
};
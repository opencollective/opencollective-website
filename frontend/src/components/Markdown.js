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
  }

  splitIntoSections(content) {
    const { sections } = processMarkdown(content);
    const sections_array = [];
    for (const title in sections) {
      const section = sections[title];
      sections_array.push({title, markdown:`${title !== 'intro' ? `# ${title}` : ''}\n\n${section}`});
    }
    return sections_array;
  }

  render() {
    const {
      value,
      className,
      onChange,
      splitIntoSections,
      placeholder,
      i18n
    } = this.props;

    const placeholderClass = (value) ? '' : 'placeholder';

    if (!this.state.editMode) {
      const content = (value && value.trim() !== '') ? value : placeholder;
      if (splitIntoSections) {
        const sections = this.splitIntoSections(content);
        // we split it into multiple sections
        return (
          <div>
            { sections.map(section =>
              <div className='section' id={formatAnchor(section.title)}>
                <div
                  className={`${className} container ${placeholderClass}`}
                  dangerouslySetInnerHTML={ this.rawMarkup(section.markdown)}
                  onClick={ this.onClick } />
              </div>
            )}
          </div>);
      } else {
        return (
          <div
            className={`ContentEditable ${className} container ${placeholderClass}`}
            dangerouslySetInnerHTML={ this.rawMarkup(content)}
            onClick={ this.onClick } />
        );
      }
    } else {
      const content = (value === '' || value) ? value : placeholder;
      return (
        <CustomTextArea
          ref='markdownCustomTextArea'
          rows={ (content.length/60 + (content.match(/\n/g) || []).length) || 4 }
          resize='vertical'
          className={`ContentEditable ${className} ${placeholderClass}`}
          value={ content }
          placeholder={ placeholder || i18n.getString('defaultLongDescription') }
          onChange={ onChange }
          onBlur={ this.onBlur }
          setFocus={ true } />
        )
    }
  }

  processHTML(html) {
    let lines = html.split('\n');
    lines = lines.map(line => {
      let videoid;
      if (line.match(/^<p><a .*https?:\/\/youtu.be.*<\/a><\/p>$/))
        videoid = line.match(/youtu.be\/([^\/\?]+)/)[1];
      else if (line.match(/^<p><a .*https?:\/\/(www\.)?youtube\.com.*<\/a><\/p>$/))
        videoid = line.match(/watch\?v=([^&]*)/)[1];

      if (videoid) {
        line = `<div class='video'>
          <iframe
            width=560
            height=315
            src="https://www.youtube.com/embed/${videoid}"
            frameborder='0'
            allowFullScreen>
          </iframe>
        </div>`;
      }
      return line;
    });
    return lines.join('\n');
  }

  rawMarkup(text) {
    const rawMarkup = (text) ? marked(text, {sanitize: true}) : '';

    return { __html: this.processHTML(rawMarkup) };
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
  canEdit: PropTypes.bool,
  placeholder: PropTypes.string,
  splitIntoSections: PropTypes.bool
};

Markdown.defaultProps = {
  value: '',
  className: '',
  placeholder: '',
  canEdit: false,
  splitIntoSections: false,
  onChange: () => {}
};
import React, { Component } from 'react';

import CustomTextArea from '../CustomTextArea';

export default class SettingsMailing extends Component {

  constructor(props) {
    super(props);
    this.state = {
      markdown: props.markdown,
    };
    this.onChangeMarkdownRef = this.onChangeMarkdown.bind(this);
    this.onSaveRef = this.onSave.bind(this);
  }

  render() {
    const {markdown} = this.state;
    const changed = this.hasChanged();
    return (
      <div className='SettingsMailing'>
        <div className='SettingsPageH1'>Mailing</div>
          <div className='SettingsPageLead' style={{marginTop: '30px'}}>
            Write your “Thanks for donations” e-mail <i>*markdown is supported</i>
          </div>
          <CustomTextArea maxLength={600} value={markdown} onChange={this.onChangeMarkdownRef}/>
          <div
          className={`SettingsPageButton ${!changed ? 'SettingsPageButton--disabled' : ''}`}
          onClick={changed ? this.onSaveRef : null}
          style={{marginTop: '40px'}}>Send E-mail</div>
      </div>
    )
  }

  hasChanged() {
    const propsMarkdown = this.props.markdown || '';
    const stateMarkdown = this.state.markdown || '';
    return propsMarkdown !== stateMarkdown;
  }

  onChangeMarkdown(value){
    this.setState({markdown: value});
  }

  onSave() {
    const {markdown} = this.state;
    const {onSave} = this.props;
    console.log('markdown')
    onSave({markdown});
  }
}

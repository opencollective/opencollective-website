import React, { Component } from 'react';

import CustomSelect from '../CustomSelect';

const languages = [
  {value: 'en', label: 'English'},
  {value: 'es', label: 'Spanish'},
  {value: 'fr', label: 'French'},
];

const currencies = [
  {value: 'EUR', label: 'EUR'},
  {value: 'MXN', label: 'MXN'},
  {value: 'USD', label: 'USD'},
];

export default class SettingsGeneral extends Component {

  constructor(props) {
    super(props);
    this.state = {
      currency: props.currency || currencies[0].value,
      language: props.language || languages[0].value,
    };
    this.onChangeCurrencyRef = this.onChangeCurrency.bind(this);
    this.onChangeLanguageRef = this.onChangeLanguage.bind(this);
    this.onSaveRef = this.onSave.bind(this);
  }

  render() {
    const {currency, language} = this.state;
    const changed = this.hasChanged();
    return (
      <div className='SettingsGeneral'>
        <div className='SettingsPageH1'>General</div>
        <div className='SettingsPageHr'>
          <div>Language</div>
        </div>
        <CustomSelect onChange={this.onChangeLanguageRef} value={language}>
          {languages.map(language => <option key={language.value} value={language.value}>{language.label}</option>)}
        </CustomSelect>
        <div className='SettingsPageHr'>
          <div>Currency</div>
        </div>
        <CustomSelect onChange={this.onChangeCurrencyRef} value={currency}>
          {currencies.map(currency => <option key={currency.value} value={currency.value}>{currency.label}</option>)}
        </CustomSelect>
        <div
          className={`SettingsPageButton ${ !changed ? 'SettingsPageButton--disabled' : '' }`}
          style={{marginTop: '40px'}}
          onClick={changed ? this.onSaveRef : null}>Save</div>
      </div>
    )
  }

  hasChanged() {
    const props = this.props;
    const state = this.state;
    let changed = false;
    ['currency', 'language']
    .forEach(propName => {
      changed = props[propName] !== state[propName]
    });
    return changed;
  }

  onChangeCurrency(value){
    this.setState({currency: value});
  }

  onChangeLanguage(value){
    this.setState({language: value});
  }

  onSave() {
    const {currency, language} = this.state;
    const {onSave} = this.props;
    onSave({currency, language});
  }
}

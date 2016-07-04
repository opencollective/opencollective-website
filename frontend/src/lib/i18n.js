import moment from './moment'
import strings from '../ui/strings.json';

module.exports = (lang) => {
  lang = lang || 'en';
  moment.locale(lang);
  console.log("Setting moment lang to ", lang);
  console.log(moment.locales());
  return {
    getString: (strid) => {
      return strings[lang][strid] || strings['en'][strid];
    },
    moment
  };  
}
import moment from './moment'
import strings from '../ui/strings.json'; // eslint-disable-line

export default (lang = 'en') => {
  moment.locale(lang);
  return {
    getString: (strid, replacements = {}) => {
      // if it can't find the string anywhere, it return the string itself. 
      // Catchall to handle tier weirdness
      
      let str = strings[lang][strid] || strings['en'][strid] || strid; 
      for (const key of Object.keys(replacements)) {
        str = str.replace(`$${key}`, replacements[key] || '');
      }
      return str;
    },
    moment
  };
}

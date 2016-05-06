import moment from './moment'
import strings from '../ui/strings.json';

module.exports = (lang) => {
  moment.locale(lang);
  return {
    getString: (strid) => {
      return strings[lang][strid]; // TODO: We should add a `lang` column in the `Groups` table and use that instead of `currency`
    },
    moment
  };  
}
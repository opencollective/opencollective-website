import Numbro from 'numbro';
import 'numbro/dist/languages'

export default (
  value = 0,
  currency = 'USD',
  options = {
    precision: 2,
    compact: true }
) => {

  // This is necessary because if only one option field is passed, the other becomes undefined
  // Feels like there must be a better way to pass options
  options.precision = (options.precision === undefined) ? 2 : options.precision;
  options.compact = (typeof options.compact === 'boolean') ? options.compact : true;

  let lang = 'en-US';
  switch(currency) {
    case 'EUR': lang = 'fr-FR';
          break;
    case 'SEK': lang = 'sv-SE';
          break;
    case 'GBP': lang = 'en-GB';
          break;
  }

  Numbro.culture(lang);

  // remove the negative sign from the value
  const number = Numbro(Math.abs(value));
  let formatted = (options.precision === 0) ? number.format('$0,0') : number.format('$0,0.00');

  if (!options.compact) {
    formatted = `${currency} ${formatted}`;
  }
  return formatted;
};
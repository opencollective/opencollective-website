import filter from 'lodash/filter';
import values from 'lodash/values';

export default (collection, validator) => filter(values(collection), validator);

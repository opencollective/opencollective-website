import filter from 'lodash/collection/filter';
import values from 'lodash/object/values';

export default (collection, validator) => filter(values(collection), validator);

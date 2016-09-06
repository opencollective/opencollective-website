import values from 'lodash/values';

export default (collection, validator) => values(collection).filter(validator);

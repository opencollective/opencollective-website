import Joi from 'joi';

export default (obj, schema) => {
  const { error, value } = Joi.validate(obj, schema);

  return error ? Promise.reject(error) : Promise.resolve(value);
};

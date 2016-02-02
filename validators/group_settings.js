import Joi from 'joi';
import validate from '../lib/validate';

/**
 * Profile form schema
 */

const schema = Joi.object().keys({
  name: Joi.string(),
  description: Joi.string().max(95),
  longDescription: Joi.string(),
  logo: Joi.string().uri(),
  image: Joi.string().uri(),
});

export default (obj) => validate(obj, schema);

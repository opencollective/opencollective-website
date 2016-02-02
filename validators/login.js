import Joi from 'joi';
import validate from '../lib/validate';

/**
 * Login form schema
 */

const schema = Joi.object().keys({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).max(128).required(),
});

export default (obj) => validate(obj, schema);

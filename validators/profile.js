import Joi from 'joi';
import validate from '../lib/validate';

/**
 * Profile form schema
 */

const schema = Joi.object().keys({
  paypalEmail: Joi.string().email()
    .label('PayPal account'),
  link: Joi.string().uri()
    .label('Photo'),
  password: Joi.string()
    .label('Password'),
  passwordConfirmation: Joi.any().valid(Joi.ref('password'))
    .label('password confirmation').options({
      language: { any: { allowOnly: 'must match password' } }
    })
});

export default (obj) => validate(obj, schema);

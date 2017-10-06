import Joi from 'joi';

import validate from '../lib/validate';

/**
 * New expense schema
 */
const schema = Joi.object().keys({
  fundsFromHost: Joi.boolean(),
  totalAmount: Joi.number().integer().min(1).required()
    .label('Amount'),
  description: Joi.string().required()
    .label('Description'),
  privateMessage: Joi.string()
    .label('Private message')
    .allow(''),
  name: Joi.when('fundsFromHost', {is: true, otherwise: Joi.string().required()})
    .label('Name'),
  email: Joi.when('fundsFromHost', {is: true, otherwise: Joi.string().email().required()})
    .label('Email'),
});

export default (obj) => validate(obj, schema);

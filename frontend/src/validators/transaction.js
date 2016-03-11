import Joi from 'joi';
import pluck from 'lodash/collection/pluck';

import dates from '../lib/dates';
import validate from '../lib/validate';
import paymentMethods from '../ui/payment_methods';

/**
 * New transaction schema
 */
const schema = Joi.object().keys({
  link: Joi.string().uri()
    .label('Photo')
    .allow(null),
  description: Joi.string().required()
    .label('Description'),
  amount: Joi.number().precision(2).required()
    .label('Amount'),
  vat: Joi.number().precision(2).min(0).allow(null)
    .label('VAT'),
  createdAt: Joi.date().max(dates().tomorrow).required()
    .raw() // doesn't convert date into Date object
    .label('CreatedAt'),
  approvedAt: Joi.date().max(dates().tomorrow)
    .raw() // doesn't convert date into Date object
    .label('Date')
    .allow(null),
  tags: Joi.array().items(Joi.string()).required()
    .label('Category'),
  approved: Joi.boolean(),
  paymentMethod: Joi.string().valid(pluck(paymentMethods, 'value'))
    .label('Reimbursement method'),
  email: Joi.string().email()
    .label('Email')
    .allow(null),
  paypalEmail: Joi.string().email()
    .label('PayPal email')
    .allow(null),
  comment: Joi.string()
    .label('Comment')
    .allow(null),
});

export default (obj) => validate(obj, schema);

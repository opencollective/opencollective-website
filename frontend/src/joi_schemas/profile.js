import Joi from 'joi';

const schema = Joi.alternatives().try(
  Joi.object().keys({
    name: Joi.string().allow('').label('Name'),
    website: Joi.string().uri().allow('').label('Website'),
    twitterHandle: Joi.string().allow('').label('Twitter username')
  })
);

export default schema;
import Joi from 'joi';

const schema = Joi.alternatives().try(
  Joi.object().keys({
    username: Joi.string().label('Username'),
    name: Joi.string().allow('').label('Name'),
    description: Joi.string().max(255).allow('').label('description'),
    longDescription: Joi.string().allow('').label('long description'),
    website: Joi.string().uri().allow('').label('Website'),
    twitterHandle: Joi.string().allow('').label('Twitter username'),
    avatar: Joi.string().allow('').label('Avatar')
  })
);

export default schema;
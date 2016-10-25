import Joi from 'joi';

const user = Joi.object().keys({
  firstName: Joi.string().allow(''),
  lastName: Joi.string().allow(''),
  email: Joi.string().email().required(),
  twitterHandle: Joi.string().allow(''),
  avatar: Joi.string().uri().allow(''),
  role: Joi.string()
});

const schema = Joi.alternatives().try(
  Joi.object().keys({
    name: Joi.string().label('Collective name').required(),
    slug: Joi.string().regex(/^[a-z1-9-_]+$/i, 'alpha numeric with dash or underscore').label('URL').required(),
    currency: Joi.string().label('Currency'),
    website: Joi.string().uri().allow('').label('Website url'),
    video: Joi.string().uri().allow('').label('Video url'),
    image: Joi.string().uri().allow('').label('Image url'),
    logo: Joi.string().uri().allow('').label('Logo url'),
    mission: Joi.string().max(100).label('Mission'),
    description: Joi.string().max(255).label('Short description'),
    longDescription: Joi.string().max(1000).label('Full description'),
    data: Joi.object(),
    tags: Joi.array().items(Joi.string()).label('Tags'),
    users: Joi.array().items(user),
    tos: Joi.boolean().label('please approve the terms of service').required()
  }).unknown()
);

export default schema;
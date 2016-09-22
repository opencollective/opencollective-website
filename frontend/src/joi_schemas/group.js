import Joi from 'joi';

const user = Joi.object().keys({
  firstName: Joi.string().allow(''),
  lastName: Joi.string().allow(''),
  email: Joi.string().email(),
  twitterHandle: Joi.string().allow(''),
  avatar: Joi.string().uri().allow(''),
  role: Joi.string()
});

const schema = Joi.alternatives().try(
  Joi.object().keys({
    name: Joi.string().label('Collective name').required(),
    slug: Joi.string().label('Slug').required(),
    currency: Joi.string().label('Currency'),
    website: Joi.string().uri().allow('').label('Website url'),
    video: Joi.string().uri().allow('').label('Video url'),
    image: Joi.string().uri().allow('').label('Image url'),
    logo: Joi.string().uri().allow('').label('Logo url'),
    mission: Joi.string().max(100).label('Mission'),
    description: Joi.string().max(255).label('Short description'),
    longDescription: Joi.string().max(1000).label('Full description'),
    whyJoin: Joi.string().max(255).label('Why Join?'),
    tags: Joi.string().label('Tags'),
    users: Joi.array().items(user),
  })
);

export default schema;
import Joi from 'joi';

const schema = Joi.alternatives().try(
  Joi.object().keys({
    name: Joi.string().label('Collective name'),
    logo: Joi.string().uri().allow('').label('Logo url'),
    mission: Joi.string().max(100).label('Mission'),
    longDescription: Joi.string().label('Full description')
  })
);

export default schema;
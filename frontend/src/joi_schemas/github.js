import Joi from 'joi';
import { MIN_CONTRIBUTORS_FOR_ONBOARDING } from '../constants/github';

const schema = Joi.alternatives().try(
  Joi.object().keys({
    username: Joi.string().label('Userame'),
    repository: Joi.string().label('Repository'),
    contributors: Joi.array().min(MIN_CONTRIBUTORS_FOR_ONBOARDING).unique().items(Joi.string()).label('Core Contributors'),
    mission: Joi.string().max(100).label('Mission'),
    description: Joi.string().max(255).label('Group Description'),
    logo: Joi.string().allow('').label('Repository Logo'),
    token: Joi.string().label('Github Access Token'),
    tags: Joi.string().label('Tags').allow('')
  })
);

export default schema;
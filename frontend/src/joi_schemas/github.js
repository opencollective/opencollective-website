import Joi from 'joi';
import { MIN_CONTRIBUTORS_FOR_ONBOARDING } from '../constants/github';

const schema = Joi.alternatives().try(
  Joi.object().keys({
    username: Joi.string().label('Userame'),
    repository: Joi.string().label('Repository'),
    repoOwner: Joi.string().label('Repository Owner'),
    contributors: Joi.array().min(MIN_CONTRIBUTORS_FOR_ONBOARDING).unique().items(Joi.string()).label('Core Contributors'),
    missionDescription: Joi.string().max(100).label('Mission Description'),
    expenseDescription: Joi.string().max(100).label('Expense Description'),
    logo: Joi.string().allow('').label('Repository Logo'),
    token: Joi.string().label('Github Access Token')
  })
);

export default schema;
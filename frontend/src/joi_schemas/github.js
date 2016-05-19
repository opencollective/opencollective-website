import Joi from 'joi';

const schema = Joi.alternatives().try(
  Joi.object().keys({
    username: Joi.string().label('Userame'),
    repo: Joi.string().label('Repository'),
    contributors: Joi.array().min(2).unique().items(Joi.string()).label('Core Contributors'),
    missionDescription: Joi.string().max(100).label('Mission Description'),
    expenseDescription: Joi.string().max(100).label('Expense Description'),
    logo: Joi.string().allow('').label('Repository Logo'),
    token: Joi.string().label('Github Access Token')
  })
);

export default schema;
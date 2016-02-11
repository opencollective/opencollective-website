/**
 * Return the first detail of a validation error with Joi
 */

export default action => {
  if (action.error && action.error.name === 'ValidationError') {
    return action.error.details && action.error.details[0] ?
      action.error.details[0] :
      {};
  }

  return {};
};

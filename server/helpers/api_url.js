import _ from 'lodash';
import config from 'config';

export default url => {
  const withoutParams = config.apiUrl + (url.replace('/api/', ''));
  const hasParams = _.contains(url, '?');

  return `${withoutParams}${hasParams ? '&' : '?'}api_key=${config.apiKey}`;
};

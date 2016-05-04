import contains from 'lodash/collection/contains';
import config from 'config';

export default url => {
  const withoutParams = config.host.api + (url.replace('/api/', '/'));
  const hasParams = contains(url, '?');

  return `${withoutParams}${hasParams ? '&' : '?'}api_key=${config.apiKey}`;
};
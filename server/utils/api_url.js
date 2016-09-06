import config from 'config';

export default url => {
  const withoutParams = config.host.api + (url.replace('/api/', '/'));
  const hasParams = `${url}`.match(/\?/) 

  return `${withoutParams}${hasParams ? '&' : '?'}api_key=${config.apiKey}`;
};

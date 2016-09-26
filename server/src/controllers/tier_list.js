import api from '../lib/api';

/*
* Converts an Array of Objects (a collection) into a csv formatted String.
* Covers RFC4180 (https://tools.ietf.org/html/rfc4180)
*
* @param json {Array} of Objects
* @param [customHeaders] {Array} of Strings to specify ields to extract, and their order.
* @return {String}
*/
function jsonToCsv(json, customHeaders) {
  const NL = '\r\n', DELIM = ',', QUOTE = '"';
  const headers = customHeaders || Object.keys(json[0]);
  const formatValue = value => {
    const hasLineBreak = value.indexOf(NL) !== -1;
    const hasComma = value.indexOf(DELIM) !== -1;
    const hasDblQuote = value.indexOf(QUOTE) !== -1;
    if (hasLineBreak || hasComma || hasDblQuote) {
      return (hasDblQuote) ? `"${ value.replace(new RegExp(QUOTE, 'g'), `${QUOTE}${QUOTE}`) }"` : `"${ value }"`;
    } else {
      return value;
    }
  };
  const body = json.map(entry => {
    const values = [];
    headers.forEach(h => values.push(formatValue(String(entry[h] || ''))));
    return values.join(DELIM);
  });
  body.unshift(headers.map(formatValue).join(DELIM));
  return body.join(NL);
}

export default (req, res, next) => {
  const { group } = req;
  const { tier, format } = req.params;
  
  api
  .get(`/groups/${group.id}/tiers/${tier}`)
  .then(tierList => {
    if (format === 'json') {
      res.json(tierList);
    } else if (format === 'csv') {
      res.setHeader('Content-Type', 'text/csv; charset=utf-8');
      res.end(jsonToCsv(tierList));
    } else {
      next(new Error('Invalid format, must be either csv or json'));
    }
  })
  .then(next)
  .catch(next);
}

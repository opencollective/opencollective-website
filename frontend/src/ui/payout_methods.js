import i18nlib from '../lib/i18n';

/**
 * Static data the for the payment methods (transaction)
 */
export default (lang) => {
  const i18n = i18nlib(lang);
  return [
    {
      label: 'PayPal',
      value: 'paypal'
    },
    {
      label: i18n.getString('payoutMethods-alreadyReimbursed'),
      value: 'manual'
    },
    {
      label: i18n.getString('payoutMethods-other'),
      value: 'other'
    }
  ];
}
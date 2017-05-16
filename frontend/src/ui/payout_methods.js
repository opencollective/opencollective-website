/**
 * Static data the for the payment methods (transaction)
 */
export default (i18n) => {
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
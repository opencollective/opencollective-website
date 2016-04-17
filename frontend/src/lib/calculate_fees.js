export default (amount, hostFeePercent) => {
  // Simplest solution
  const paymentProcessorFee = amount*0.029 + 0.30;
  const hostFee = amount*hostFeePercent/100;
  const platformFee = amount*0.05;

  const totalFee = Math.round((paymentProcessorFee+hostFee+platformFee) * 1e2)/1e2;
  return totalFee;
};


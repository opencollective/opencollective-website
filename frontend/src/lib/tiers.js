const getTier = (query, tiers) => {

  // We order the tiers by start range DESC
  tiers.sort((a,b) => {
    return a.range[0] < b.range[0];
  });

  // We get the first tier for which the totalDonations is higher than the minimum amount for that tier
  const tier = tiers.find((tier) => {
    if (query.interval && query.interval !== tier.interval) return false;
    if (query.amount && query.amount >= tier.range[0] && query.amount <= tier.range[1]) return true;
    return false;
  });

  return tier;
};

module.exports = { getTier };
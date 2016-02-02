export default () => {
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate()+1);

  return {
    today: today.toISOString().slice(0,10),
    tomorrow: tomorrow.toISOString().slice(0,10)
  };
};

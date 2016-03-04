export default (expirationDate) => {
  const now = parseInt(Date.now() / 1000, 10);

  return expirationDate < now;
}
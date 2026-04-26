const formatPrice = (amount, currency = "₹") => {
  const value = Number(amount);
  return `${currency}${Number.isFinite(value) ? value.toFixed(2) : "0.00"}`;
};

export default formatPrice;

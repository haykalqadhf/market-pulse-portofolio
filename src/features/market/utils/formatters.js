export const formatCurrency = (value, currencyCode = 'usd') => {
  if (value === null || value === undefined) return '-';
  
  const currencyUpper = currencyCode.toUpperCase();
  // Sesuaikan bahasa pemformatan berdasarkan mata uang agar peletakan simbolnya natural
  const locale = currencyCode.toLowerCase() === 'idr' ? 'id-ID' : 'en-US';
  
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currencyUpper,
    // Rupiah (IDR) & Yen (JPY) umumnya tidak menggunakan sen/desimal di belakang koma
    minimumFractionDigits: currencyCode.toLowerCase() === 'idr' || currencyCode.toLowerCase() === 'jpy' ? 0 : 2,
    maximumFractionDigits: 2,
  }).format(value);
};

export const formatPercentage = (value) => {
  if (value === null || value === undefined) return '0.00%';
  return `${value > 0 ? '+' : ''}${value.toFixed(2)}%`;
};
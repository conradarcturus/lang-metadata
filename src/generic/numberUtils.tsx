/**
 * For some reason, the Intl.NumberFormat library doesn't long currencies with
 * compact long format (eg. 1 million $) so we have to force it.
 */
export function getCurrencyCompactLong(num: number): string {
  const numCompactLong = Intl.NumberFormat(undefined, {
    notation: 'compact',
    compactDisplay: 'long',
  }).format(num);
  const currencyFormat = Intl.NumberFormat(undefined, {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(10);
  return currencyFormat.replace(/\p{Decimal_Number}+/u, numCompactLong);
}

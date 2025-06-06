/**
 * When showing numbers there may be both very small and large numbers in the same context.
 * While generally we'd want them to be compared with the same number of decimals (eg. 13.1% and 6.8%),
 * when there are very small numbers (eg. 0.0023%) that will easily be rounded to oblivion (0.00%), so
 * this function will still show small numbers.
 */
export function numberToFixedUnlessSmall(value: number, precision: number = 2): string {
  if (value > 1) {
    return value.toFixed(precision);
  }
  return value.toPrecision(precision);
}

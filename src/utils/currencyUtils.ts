/**
 * Formats a number into a currency string.
 *
 * @param {number} amount - The number to format.
 * @param {string} [currency='VND'] - The currency code (default is VND).
 * @param {string} [locale='vi-VN'] - The locale code (default is vi-VN).
 * @returns {string} - The formatted currency string.
 */
export const formatCurrency = (
  value: number | null | undefined,
  currency: string = "VND",
  locale: string = "vi-VN",
): string => {
  if (value == null) return ""; // Return an empty string for null or undefined values

  const options: Intl.NumberFormatOptions = {
    style: "currency" as const, // Use 'as const' to ensure TypeScript recognizes it as a valid style
    currency,
    minimumFractionDigits: 0, // No decimal places
    maximumFractionDigits: 0, // No decimal places
  };

  return new Intl.NumberFormat(locale, options).format(value);
};

// ex: 1000000 -> 1,000,000
export const formatNumber = (value: number | string): string => {
  return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
};

// ex: 1,000,000 -> 1000000
export const parseMoney = (value: string): number => {
  return parseInt(value.replace(/\./g, ""), 10);
};

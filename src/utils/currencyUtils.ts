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
    style: "currency" as const,
    currency,
    minimumFractionDigits: 0, // No decimal places for VND
    maximumFractionDigits: 0, // No decimal places for VND
  };

  return new Intl.NumberFormat(locale, options).format(value);
};

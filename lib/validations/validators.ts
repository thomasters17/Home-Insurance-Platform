/**
 * Custom validation functions
 * These complement Zod schemas for specific business logic
 */

/**
 * Validates UK postcode format
 * More permissive than the regex - handles various formats
 */
export function validatePostcode(postcode: string): boolean {
  if (!postcode) return false;

  // Remove spaces and convert to uppercase first
  const normalized = postcode.replace(/\s/g, '').toUpperCase();

  // After removing spaces, valid UK postcodes are usually 5-7 characters long
  if (normalized.length < 5 || normalized.length > 7) return false;

  // UK postcode pattern (outward + inward)
  const pattern = /^[A-Z]{1,2}\d{1,2}[A-Z]?\d[A-Z]{2}$/;
  return pattern.test(normalized);
}

/**
 * Formats postcode to standard UK format
 * Example: "sw1a1aa" -> "SW1A 1AA"
 */
export function formatPostcode(postcode: string): string {
  const normalized = postcode.replace(/\s/g, '').toUpperCase();

  // Insert space before last 3 characters
  if (normalized.length >= 5) {
    return `${normalized.slice(0, -3)} ${normalized.slice(-3)}`;
  }

  return normalized;
}

/**
 * Validates that date of birth indicates person is 18+
 */
export function isMinimumAge(dateOfBirth: string, minimumAge: number = 18): boolean {
  const today = new Date();
  const birthDate = new Date(dateOfBirth);

  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }

  return age >= minimumAge;
}
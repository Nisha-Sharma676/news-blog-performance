/**
 * Sanitizes user input to prevent XSS attacks by removing script tags,
 * dangerous HTML elements, and attributes.
 *
 * @param {string} input - Raw text input
 * @returns {string} Sanitized string
 */
export function sanitizeText(input) {
  if (typeof input !== 'string') return ''
  return input
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '')
    .replace(/<[^>]+>/g, '')
    .replace(/javascript:/gi, '')
    .replace(/on\w+\s*=/gi, '')
    .trim()
}

/**
 * Validates a URL to ensure it has valid syntax and uses http/https protocols.
 *
 * @param {string} urlString
 * @returns {boolean}
 */
export function isValidUrl(urlString) {
  if (!urlString || typeof urlString !== 'string') return false
  const trimmed = urlString.trim()
  try {
    const parsed = new URL(trimmed)
    return parsed.protocol === 'http:' || parsed.protocol === 'https:'
  } catch {
    return false
  }
}

/**
 * Validates that load time is a positive number.
 *
 * @param {string|number} value
 * @returns {boolean}
 */
export function isValidLoadTime(value) {
  if (value === undefined || value === null || value === '') return false
  const num = Number(value)
  return !Number.isNaN(num) && num > 0
}

/**
 * Feature: personal-portfolio-blog
 * Contact form & scalar validation helpers.
 */

export interface ContactFormValues {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export interface ContactFormErrors {
  name?: string;
  email?: string;
  message?: string;
}

/**
 * Simplified RFC 5322 email check:
 * - exactly one `@`
 * - non-empty local-part (no whitespace, no `@`)
 * - non-empty domain with at least one `.` separating a TLD-like segment
 * - no whitespace anywhere
 */
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function isNonEmpty(s: string): boolean {
  return s.trim().length > 0;
}

export function isValidEmail(s: string): boolean {
  if (typeof s !== "string") return false;
  return EMAIL_RE.test(s);
}

/**
 * Validate a contact form payload. Returns an object whose keys are only
 * present when the corresponding field has an error; an empty object means
 * the payload is valid. `subject` is not validated.
 */
export function validateContactForm(
  v: ContactFormValues,
): ContactFormErrors {
  const errors: ContactFormErrors = {};
  if (!isNonEmpty(v.name)) errors.name = "姓名不能为空";
  if (!isValidEmail(v.email)) errors.email = "邮箱格式不正确";
  if (!isNonEmpty(v.message)) errors.message = "消息内容不能为空";
  return errors;
}

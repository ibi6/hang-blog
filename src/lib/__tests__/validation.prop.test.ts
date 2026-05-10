/**
 * Feature: personal-portfolio-blog
 * Property 6: 联系表单校验的 iff 关系
 * Validates: Requirement 10.3
 */
import { describe, it, expect } from "vitest";
import fc from "fast-check";
import {
  isNonEmpty,
  isValidEmail,
  validateContactForm,
  type ContactFormValues,
} from "../validation";

// Invalid email generator: strings without any '@', with multiple '@', or
// missing a domain dot.
const invalidEmailArb = fc.oneof(
  fc.string().filter((s) => !s.includes("@")),
  fc.tuple(fc.string(), fc.string(), fc.string()).map(
    ([a, b, c]) => `${a}@${b}@${c}`,
  ),
  // no TLD dot
  fc.tuple(fc.string({ minLength: 1 }), fc.string({ minLength: 1 })).map(
    ([a, b]) => `${a}@${b.replace(/\./g, "x")}`,
  ),
  // whitespace anywhere
  fc.string().map((s) => ` ${s} @ foo.com`),
);

const nameArb = fc.oneof(
  fc.constant(""),
  fc.stringMatching(/^[ \t\n]*$/),
  fc.string({ minLength: 1 }).filter((s) => s.trim().length > 0),
);

const messageArb = nameArb;

const emailArb = fc.oneof(fc.emailAddress(), invalidEmailArb);

const valuesArb: fc.Arbitrary<ContactFormValues> = fc.record({
  name: nameArb,
  email: emailArb,
  subject: fc.string(),
  message: messageArb,
});

describe("validateContactForm (Property 6)", () => {
  it("errors iff the corresponding rule fails, and empty when all pass", () => {
    fc.assert(
      fc.property(valuesArb, (v) => {
        const errors = validateContactForm(v);

        const nameEmpty = v.name.trim() === "";
        const emailBad = !isValidEmail(v.email);
        const msgEmpty = v.message.trim() === "";

        // (a) name iff
        expect("name" in errors).toBe(nameEmpty);
        // (b) email iff
        expect("email" in errors).toBe(emailBad);
        // (c) message iff
        expect("message" in errors).toBe(msgEmpty);

        // (d) all-valid implies empty errors object
        if (!nameEmpty && !emailBad && !msgEmpty) {
          expect(errors).toEqual({});
        }
      }),
    );
  });

  it("isNonEmpty: false iff trimmed is empty", () => {
    fc.assert(
      fc.property(fc.string(), (s) => {
        expect(isNonEmpty(s)).toBe(s.trim().length > 0);
      }),
    );
  });
});

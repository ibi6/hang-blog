/**
 * Feature: personal-portfolio-blog
 *
 * `ContactForm` — controlled form that validates inputs in the browser
 * and submits via EmailJS. When the EmailJS environment variables are
 * missing the form degrades gracefully: the submit button is disabled
 * and a hint directs the visitor to email directly instead.
 *
 * Requirements: 10.1, 10.3, 10.4, 10.5, 10.6, 10.7, 13.1, 13.4
 */
import { useMemo, useState, type FormEvent } from "react";
import emailjs from "@emailjs/browser";
import {
  validateContactForm,
  type ContactFormErrors,
  type ContactFormValues,
} from "../../lib/validation";
import { GlassCard } from "../glass/GlassCard";
import { GlassButton } from "../glass/GlassButton";
import { GlassInput, GlassTextarea } from "../glass/GlassInput";
import { cn } from "../../lib/cn";

type SubmissionStatus = "idle" | "submitting" | "success" | "error";

const EMPTY_VALUES: ContactFormValues = {
  name: "",
  email: "",
  subject: "",
  message: "",
};

interface EmailJSConfig {
  serviceId: string;
  templateId: string;
  publicKey: string;
}

function readEmailJSConfig(): EmailJSConfig | null {
  const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
  const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
  const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;
  if (
    typeof serviceId !== "string" ||
    typeof templateId !== "string" ||
    typeof publicKey !== "string" ||
    serviceId.length === 0 ||
    templateId.length === 0 ||
    publicKey.length === 0
  ) {
    return null;
  }
  return { serviceId, templateId, publicKey };
}

interface FieldProps {
  id: string;
  label: string;
  error: string | undefined;
  required?: boolean;
  children: (describedBy: string | undefined) => JSX.Element;
}

function Field({
  id,
  label,
  error,
  required,
  children,
}: FieldProps): JSX.Element {
  const errorId = `err-${id}`;
  return (
    <div className="flex flex-col gap-1.5">
      <label
        htmlFor={id}
        className="text-sm font-medium text-textPrimary"
      >
        {label}
        {required === true && (
          <span aria-hidden="true" className="ml-0.5 text-accent">
            *
          </span>
        )}
      </label>
      {children(error !== undefined ? errorId : undefined)}
      {error !== undefined && (
        <p
          id={errorId}
          role="alert"
          className="text-xs text-red-500 dark:text-red-400"
        >
          {error}
        </p>
      )}
    </div>
  );
}

export function ContactForm(): JSX.Element {
  const config = useMemo(readEmailJSConfig, []);
  const [values, setValues] = useState<ContactFormValues>(EMPTY_VALUES);
  const [errors, setErrors] = useState<ContactFormErrors>({});
  const [status, setStatus] = useState<SubmissionStatus>("idle");

  const configured = config !== null;
  const isSubmitting = status === "submitting";

  const update = <K extends keyof ContactFormValues>(
    key: K,
    value: ContactFormValues[K],
  ): void => {
    setValues((v) => ({ ...v, [key]: value }));
    if (errors[key as "name" | "email" | "message"] !== undefined) {
      setErrors((e) => {
        const copy = { ...e };
        delete copy[key as "name" | "email" | "message"];
        return copy;
      });
    }
  };

  async function handleSubmit(e: FormEvent<HTMLFormElement>): Promise<void> {
    e.preventDefault();
    const nextErrors = validateContactForm(values);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;
    if (config === null) return;

    setStatus("submitting");
    try {
      await emailjs.send(
        config.serviceId,
        config.templateId,
        {
          from_name: values.name,
          reply_to: values.email,
          subject: values.subject,
          message: values.message,
        },
        { publicKey: config.publicKey },
      );
      setStatus("success");
      setValues(EMPTY_VALUES);
    } catch {
      setStatus("error");
    }
  }

  return (
    <GlassCard
      as="section"
      aria-labelledby="contact-form-heading"
      className="space-y-6 p-6 md:p-8"
    >
      <header className="space-y-2">
        <h2
          id="contact-form-heading"
          className="text-lg font-semibold text-textPrimary"
        >
          发送消息
        </h2>
        <p className="text-sm text-textSecondary">
          有合作、交流或仅仅想打个招呼，都欢迎留言。
        </p>
      </header>

      {!configured && (
        <div
          role="status"
          className={cn(
            "glass rounded-2xl p-4 text-sm",
            "text-textSecondary",
          )}
        >
          当前环境未配置邮件服务。你也可以直接发送邮件给{" "}
          <a
            href="mailto:hello@linshinan.dev"
            className="text-accent underline-offset-4 hover:underline"
          >
            hello@linshinan.dev
          </a>
          。
        </div>
      )}

      {status === "success" && (
        <div
          role="status"
          className={cn(
            "glass rounded-2xl p-4 text-sm",
            "border border-emerald-400/40 text-emerald-600 dark:text-emerald-400",
          )}
        >
          消息已发送，感谢！我会尽快回复。
        </div>
      )}

      {status === "error" && (
        <div
          role="alert"
          className={cn(
            "glass rounded-2xl p-4 text-sm",
            "border border-red-400/40 text-red-600 dark:text-red-400",
          )}
        >
          消息发送失败，请稍后再试，或直接发送邮件。
        </div>
      )}

      <form
        noValidate
        onSubmit={(e) => {
          void handleSubmit(e);
        }}
        className="space-y-4"
      >
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <Field id="name" label="姓名" error={errors.name} required>
            {(describedBy) => (
              <GlassInput
                id="name"
                name="name"
                type="text"
                autoComplete="name"
                value={values.name}
                onChange={(e) => update("name", e.target.value)}
                aria-invalid={errors.name !== undefined}
                aria-describedby={describedBy}
                disabled={isSubmitting}
              />
            )}
          </Field>
          <Field id="email" label="邮箱" error={errors.email} required>
            {(describedBy) => (
              <GlassInput
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                value={values.email}
                onChange={(e) => update("email", e.target.value)}
                aria-invalid={errors.email !== undefined}
                aria-describedby={describedBy}
                disabled={isSubmitting}
              />
            )}
          </Field>
        </div>
        <Field id="subject" label="主题" error={undefined}>
          {() => (
            <GlassInput
              id="subject"
              name="subject"
              type="text"
              value={values.subject}
              onChange={(e) => update("subject", e.target.value)}
              disabled={isSubmitting}
            />
          )}
        </Field>
        <Field id="message" label="消息" error={errors.message} required>
          {(describedBy) => (
            <GlassTextarea
              id="message"
              name="message"
              rows={6}
              value={values.message}
              onChange={(e) => update("message", e.target.value)}
              aria-invalid={errors.message !== undefined}
              aria-describedby={describedBy}
              disabled={isSubmitting}
            />
          )}
        </Field>
        <div className="flex items-center gap-3">
          <GlassButton
            type="submit"
            variant="primary"
            disabled={isSubmitting || !configured}
          >
            {isSubmitting ? "发送中…" : "发送消息"}
          </GlassButton>
          {isSubmitting && (
            <span className="text-xs text-textSecondary" aria-live="polite">
              正在发送，请稍候…
            </span>
          )}
        </div>
      </form>
    </GlassCard>
  );
}

export default ContactForm;

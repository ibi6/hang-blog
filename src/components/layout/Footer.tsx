/**
 * Feature: personal-portfolio-blog
 *
 * `Footer` — bottom-of-page glassmorphism panel containing copyright
 * text and social icon links derived from `author.social`.
 *
 * Requirements: 11.1, 11.2, 11.3, 13.4, 13.5
 */
import { author } from "../../data/author";
import type { SocialLink } from "../../types/author";
import { cn } from "../../lib/cn";

interface IconProps {
  className?: string;
}

function GitHubIcon({ className }: IconProps): JSX.Element {
  return (
    <svg
      viewBox="0 0 24 24"
      width="20"
      height="20"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      className={className}
    >
      <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
    </svg>
  );
}

function LinkedInIcon({ className }: IconProps): JSX.Element {
  return (
    <svg
      viewBox="0 0 24 24"
      width="20"
      height="20"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      className={className}
    >
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect x="2" y="9" width="4" height="12" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  );
}

function TwitterIcon({ className }: IconProps): JSX.Element {
  return (
    <svg
      viewBox="0 0 24 24"
      width="20"
      height="20"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      className={className}
    >
      <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z" />
    </svg>
  );
}

function MailIcon({ className }: IconProps): JSX.Element {
  return (
    <svg
      viewBox="0 0 24 24"
      width="20"
      height="20"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      className={className}
    >
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
      <polyline points="22,6 12,13 2,6" />
    </svg>
  );
}

function ExternalIcon({ className }: IconProps): JSX.Element {
  return (
    <svg
      viewBox="0 0 24 24"
      width="20"
      height="20"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      className={className}
    >
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
      <polyline points="15 3 21 3 21 9" />
      <line x1="10" y1="14" x2="21" y2="3" />
    </svg>
  );
}

function SocialIcon({ platform }: { platform: string }): JSX.Element {
  switch (platform) {
    case "github":
      return <GitHubIcon />;
    case "linkedin":
      return <LinkedInIcon />;
    case "twitter":
      return <TwitterIcon />;
    case "email":
      return <MailIcon />;
    default:
      return <ExternalIcon />;
  }
}

function isExternal(href: string): boolean {
  return /^https?:\/\//i.test(href);
}

function SocialIconLink({ link }: { link: SocialLink }): JSX.Element {
  const external = isExternal(link.href);
  return (
    <a
      href={link.href}
      aria-label={link.label}
      {...(external
        ? { target: "_blank", rel: "noopener noreferrer" }
        : {})}
      className={cn(
        "glass inline-flex h-10 w-10 items-center justify-center rounded-full",
        "text-textPrimary hover:text-accent",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2",
        "transition-colors",
      )}
    >
      <SocialIcon platform={link.platform} />
    </a>
  );
}

export function Footer(): JSX.Element {
  const year = new Date().getFullYear();
  return (
    <footer
      className={cn(
        "glass mx-4 md:mx-8 mb-4 mt-16 rounded-2xl px-6 py-8",
        "text-textPrimary",
      )}
    >
      <div
        className={cn(
          "flex flex-col items-center gap-6 text-center",
          "md:flex-row md:items-center md:justify-between md:text-left",
        )}
      >
        <div className="space-y-1">
          <p className="text-sm font-medium">
            © {year} {author.name}
          </p>
          <p className="text-xs text-textSecondary">用心打磨，保持热爱。</p>
        </div>
        <nav aria-label="社交链接">
          <ul className="flex items-center gap-3">
            {author.social.map((link) => (
              <li key={link.platform + link.href}>
                <SocialIconLink link={link} />
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </footer>
  );
}

export default Footer;

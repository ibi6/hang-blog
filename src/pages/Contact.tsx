/**
 * Feature: personal-portfolio-blog
 *
 * `Contact` — two-column layout that pairs a submission form with the
 * author's other social / email contact channels. Mobile stacks them.
 *
 * Requirements: 10.1, 10.2
 */
import { ContactForm } from "../components/contact/ContactForm";
import { SocialLinks } from "../components/contact/SocialLinks";

export function Contact(): JSX.Element {
  return (
    <section className="mx-auto max-w-6xl py-12">
      <header className="mb-10 space-y-3 text-center">
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-accent">
          联系
        </p>
        <h1 className="text-3xl font-semibold md:text-4xl">一起聊聊</h1>
        <p className="mx-auto max-w-2xl text-sm text-textSecondary">
          不论是合作提案、技术讨论，还是随便聊聊，都欢迎通过下方表单或社交平台联系我。
        </p>
      </header>
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.8fr)]">
        <ContactForm />
        <SocialLinks />
      </div>
    </section>
  );
}

export default Contact;

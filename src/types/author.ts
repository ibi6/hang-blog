export interface SocialLink {
  platform: "github" | "linkedin" | "twitter" | "email" | string;
  href: string;
  label: string;
}

export interface Skill {
  name: string;
  icon?: string;
  category?: string;
}

export interface TimelineItem {
  start: string;
  end: string | "present";
  title: string;
  org: string;
  description?: string;
}

export interface Author {
  name: string;
  headline: string;
  bio: string;
  avatar: string;
  resumeUrl?: string;
  social: SocialLink[];
  skills: Skill[];
  timeline: TimelineItem[];
}

export interface ProjectLink {
  label: string;
  href: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  cover: string;
  tags: string[];
  links: ProjectLink[];
  featured?: boolean;
  order?: number;
}

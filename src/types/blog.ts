export interface BlogFrontmatter {
  title: string;
  date: string;
  tags: string[];
  summary: string;
  author?: string;
  cover?: string;
}

export interface TocItem {
  id: string;
  text: string;
  depth: 2 | 3;
}

export interface BlogPost {
  slug: string;
  frontmatter: BlogFrontmatter;
  contentHtml: string;
  contentRaw: string;
  readingTimeMinutes: number;
  toc: TocItem[];
}

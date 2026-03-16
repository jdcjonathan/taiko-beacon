export interface FAQEntry {
  question: string;
  answer: string;
  page: string;
  query_cluster: string;
}

export interface InjectOptions {
  sitemapUrl?: string;
  outputDir: string;
  baseUrl?: string;
  pageFilter?: (path: string) => string[]; // path -> list of page keys for FAQ
}

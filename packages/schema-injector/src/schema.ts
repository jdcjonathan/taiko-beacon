import type { FAQEntry } from "./types.js";

export function buildFAQPageSchema(entries: FAQEntry[]): object {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: entries.map(({ question, answer }) => ({
      "@type": "Question" as const,
      name: question,
      acceptedAnswer: {
        "@type": "Answer" as const,
        text: answer,
      },
    })),
  };
}

export function injectFAQIntoHead(html: string, schema: object): string {
  const script = `<script type="application/ld+json">\n${JSON.stringify(schema)}\n</script>`;
  if (html.includes("</head>")) {
    return html.replace("</head>", `${script}\n</head>`);
  }
  return script + "\n" + html;
}

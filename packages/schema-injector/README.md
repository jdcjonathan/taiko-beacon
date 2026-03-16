# schema-injector (Component 2)

Injects FAQPage JSON-LD into docs.taiko.xyz HTML so that FAQ pages get schema.org markup for better AEO citation.

## FAQ seed

`faq-seed.json` contains 50 Q&A pairs with `page` and `query_cluster`. Paths are mapped to pages (e.g. `/resources/faqs` → general, ai-agents, developer) and matching FAQs are turned into a single FAQPage block.

## Run

Build and inject into a single file:

```bash
pnpm run build
pnpm run inject /path /path/to/input.html /path/to/output.html
```

Pipe HTML via stdin (path defaults to `/`):

```bash
pnpm run inject /resources/faqs < page.html > page-with-schema.html
```

## Output

Modified HTML with `<script type="application/ld+json">` containing FAQPage schema inserted before `</head>`.

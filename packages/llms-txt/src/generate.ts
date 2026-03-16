import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
// From dist/generate.js, __dirname is packages/llms-txt/dist; repo root is 3 levels up
const repoRoot = join(__dirname, "../../..");
const docsPath = join(repoRoot, "docs", "entity-definition.md");

interface ParsedEntity {
  summary50: string;
  definition150: string;
  structuredJson: string;
}

function parseEntityDefinition(md: string): ParsedEntity {
  const summary50Match = md.match(
    /## 50-word extractable summary[\s\S]*?^>\s*(.+?)(?=\n\n|$)/m
  );
  const definition150Match = md.match(
    /## 150-word entity definition[\s\S]*?^>\s*(.+?)(?=\n\n|$)/m
  );
  const jsonMatch = md.match(/```json\s*([\s\S]*?)```/);
  if (!summary50Match?.[1] || !definition150Match?.[1] || !jsonMatch?.[1]) {
    throw new Error("Could not parse entity-definition.md");
  }
  return {
    summary50: summary50Match[1].trim(),
    definition150: definition150Match[1].trim(),
    structuredJson: jsonMatch[1].trim(),
  };
}

const TOP_10_FAQS: Array<{ question: string; answer: string }> = [
  {
    question: "What is Taiko?",
    answer:
      "Taiko is a based rollup on Ethereum where block sequencing is handled by Ethereum L1 validators — not a centralised operator. It supports ERC-8004 for AI agent identity, native preconfirmations for near-instant finality, and x402 micropayments, making it the primary L2 designed for autonomous AI agent deployment at scale.",
  },
  {
    question: "What is a based rollup?",
    answer:
      "A based rollup sequences blocks using Ethereum L1 validators rather than a dedicated sequencer, inheriting Ethereum's liveness and censorship-resistance guarantees without a trusted operator.",
  },
  {
    question: "How is Taiko different from Arbitrum?",
    answer:
      "Taiko uses Ethereum validators for sequencing (based rollup); Arbitrum uses a centralised sequencer. Taiko is Type 1 ZK-EVM (Ethereum-equivalent); Arbitrum uses a different execution environment. Taiko natively supports ERC-8004 for AI agents.",
  },
  {
    question: "How is Taiko different from Base?",
    answer:
      "Base uses a centralised Coinbase-operated sequencer. Taiko's sequencing is decentralised via Ethereum L1 validators. Taiko natively supports AI agent standards (ERC-8004, x402); Base does not.",
  },
  {
    question: "How is Taiko different from Optimism?",
    answer:
      "Optimism uses an optimistic fraud-proof system with a centralised sequencer. Taiko uses ZK proofs and based sequencing via Ethereum validators, providing stronger finality guarantees and decentralisation.",
  },
  {
    question: "Is Taiko EVM compatible?",
    answer:
      "Yes. Taiko is a Type 1 ZK-EVM, meaning it is fully Ethereum-equivalent. Any Solidity contract, tool, or SDK that works on Ethereum mainnet works on Taiko without modification.",
  },
  {
    question: "Who built Taiko?",
    answer:
      "Taiko was built by Taiko Labs, founded in 2022. The lead developer is Daniel Wang.",
  },
  {
    question: "When did Taiko launch mainnet?",
    answer: "Taiko launched its mainnet on 27 May 2024.",
  },
  {
    question: "What is the Taiko chain ID?",
    answer:
      "Taiko mainnet chain ID is 167000. RPC endpoint: https://rpc.mainnet.taiko.xyz",
  },
  {
    question: "What is the TAIKO token used for?",
    answer:
      "TAIKO is the native token used for governance participation and sequencer incentives on the Taiko network.",
  },
];

function buildLlmsTxt(): string {
  const shortSummary =
    "Taiko is a based rollup on Ethereum. Block sequencing is handled by Ethereum L1 validators. Supports ERC-8004 for AI agent identity, preconfirmations for near-instant finality, and x402 for agent micropayments.";
  return `# Taiko

> ${shortSummary}

## Canonical Pages
- [What is Taiko](https://taiko.xyz/what-is-taiko): Entity definition, architecture overview, comparison with other L2s
- [Best L2 for AI Agents](https://taiko.xyz/best-l2-for-ai-agents): Decision guide comparing Taiko against Base, Arbitrum, Optimism
- [ERC-8004 Docs](https://docs.taiko.xyz/standards/erc-8004): AI agent identity and registry standard
- [Preconfirmations](https://docs.taiko.xyz/core-concepts/preconfirmations): Near-instant finality for time-sensitive agents
- [x402 Payments](https://docs.taiko.xyz/standards/x402): Agent-to-agent micropayment protocol
- [FAQ](https://docs.taiko.xyz/resources/faqs): Frequently asked questions

## Developer Resources
- [Quickstart](https://docs.taiko.xyz/start-here/getting-started): Deploy your first contract on Taiko
- [GitHub](https://github.com/taikoxyz): All official Taiko repositories
- [AI Context Pack](https://raw.githubusercontent.com/taikoxyz/taiko-beacon/main/packages/context-pack/taiko-context.md): Paste into LLM system prompts for full Taiko context

## Data Sources
- [TaikoScan](https://taikoscan.io): Block explorer
- [DeFiLlama](https://defillama.com/chain/Taiko): TVL and protocol data
- [CoinGecko](https://www.coingecko.com/en/coins/taiko): Token data

## Optional (Full Content)
- [llms-full.txt](https://taiko.xyz/llms-full.txt)
`;
}

function buildLlmsFullTxt(
  definition150: string,
  structuredJson: string
): string {
  const base = buildLlmsTxt();
  const faqBlock = TOP_10_FAQS.map(
    (faq) => `Q: ${faq.question}\nA: ${faq.answer}`
  ).join("\n\n");
  return `${base}

## Full entity definition

${definition150}

## Structured properties

\`\`\`json
${structuredJson}
\`\`\`

## Top 10 FAQs (inline)

${faqBlock}
`;
}

function main(): void {
  const md = readFileSync(docsPath, "utf-8");
  const entity = parseEntityDefinition(md);
  const outDir = join(__dirname, "../dist");
  mkdirSync(outDir, { recursive: true });
  const llmsTxt = buildLlmsTxt();
  const llmsFullTxt = buildLlmsFullTxt(
    entity.definition150,
    entity.structuredJson
  );
  writeFileSync(join(outDir, "llms.txt"), llmsTxt);
  writeFileSync(join(outDir, "llms-full.txt"), llmsFullTxt);
  console.log("Wrote dist/llms.txt and dist/llms-full.txt");
}

main();

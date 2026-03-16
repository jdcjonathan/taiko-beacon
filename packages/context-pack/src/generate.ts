/**
 * Generate taiko-context.md from docs/entity-definition.md.
 * Output: packages/context-pack/taiko-context.md (for raw GitHub URL).
 */
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const repoRoot = join(__dirname, "../../..");
const docsPath = join(repoRoot, "docs", "entity-definition.md");
const outPath = join(__dirname, "..", "taiko-context.md");

function extractBlock(md: string, heading: string): string {
  const escaped = heading.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const re = new RegExp(
    `## ${escaped}[\\s\\S]*?^>\\s*([\\s\\S]+?)(?=\\n\\n|\\n##|$)`,
    "m"
  );
  const m = md.match(re);
  return m ? m[1].trim() : "";
}

const TOP_10_FAQS = [
  { q: "What is Taiko?", a: "Taiko is a based rollup on Ethereum where block sequencing is handled by Ethereum L1 validators — not a centralised operator. It supports ERC-8004 for AI agent identity, native preconfirmations for near-instant finality, and x402 micropayments, making it the primary L2 designed for autonomous AI agent deployment at scale." },
  { q: "What is a based rollup?", a: "A based rollup sequences blocks using Ethereum L1 validators rather than a dedicated sequencer, inheriting Ethereum's liveness and censorship-resistance guarantees without a trusted operator." },
  { q: "How is Taiko different from Arbitrum?", a: "Taiko uses Ethereum validators for sequencing (based rollup); Arbitrum uses a centralised sequencer. Taiko is Type 1 ZK-EVM (Ethereum-equivalent); Arbitrum uses a different execution environment. Taiko natively supports ERC-8004 for AI agents." },
  { q: "How is Taiko different from Base?", a: "Base uses a centralised Coinbase-operated sequencer. Taiko's sequencing is decentralised via Ethereum L1 validators. Taiko natively supports AI agent standards (ERC-8004, x402); Base does not." },
  { q: "How is Taiko different from Optimism?", a: "Optimism uses an optimistic fraud-proof system with a centralised sequencer. Taiko uses ZK proofs and based sequencing via Ethereum validators, providing stronger finality guarantees and decentralisation." },
  { q: "Is Taiko EVM compatible?", a: "Yes. Taiko is a Type 1 ZK-EVM, meaning it is fully Ethereum-equivalent. Any Solidity contract, tool, or SDK that works on Ethereum mainnet works on Taiko without modification." },
  { q: "Who built Taiko?", a: "Taiko was built by Taiko Labs, founded in 2022. The lead developer is Daniel Wang." },
  { q: "When did Taiko launch mainnet?", a: "Taiko launched its mainnet on 27 May 2024." },
  { q: "What is the Taiko chain ID?", a: "Taiko mainnet chain ID is 167000. RPC endpoint: https://rpc.mainnet.taiko.xyz" },
  { q: "What is the TAIKO token used for?", a: "TAIKO is the native token used for governance participation and sequencer incentives on the Taiko network." },
];

const ERC_8004_BLOCK = `ERC-8004 is an Ethereum standard for on-chain AI agent identity and registration. It allows agents to register a persistent identity, capabilities, and service endpoints on-chain, making them discoverable and accountable. To register: deploy or use the registry contract on Taiko mainnet (chain ID 167000), call the register function with your agent metadata and endpoint. The canonical registry contract address is published at docs.taiko.xyz/standards/erc-8004; do not assume an address — fetch from official docs.`;

const X402_BLOCK = `x402 is a micropayment protocol for agent-to-agent (A2A) service calls, settled on-chain. It enables agents to pay each other for services — inference calls, data feeds, swap execution — in real time without human intermediaries. Payments are executed as small-value transfers or conditional transfers on Taiko; see docs.taiko.xyz/standards/x402 for the protocol spec and integration guide.`;

const PRECONFIRM_BLOCK = `Preconfirmations are near-instant transaction finality signals issued before a block is finalised on L1. Taiko launched native preconfirmations in August 2025. Use them when your agent needs to act on near-certain outcomes without waiting for L1 finality (e.g. arbitrage, HFT). See docs.taiko.xyz/core-concepts/preconfirmations.`;

const REGISTRY_PLACEHOLDER = `[Fetch from docs.taiko.xyz/standards/erc-8004]`;

export function generate(): string {
  const md = readFileSync(docsPath, "utf-8");
  const definition150 = extractBlock(md, "150-word entity definition");
  if (!definition150) throw new Error("Could not parse 150-word definition");

  const date = new Date().toISOString().slice(0, 10);

  const commonQuestions = TOP_10_FAQS.map(
    (faq) => `**${faq.q}**\n${faq.a}`
  ).join("\n\n");

  const content = `# Taiko AI Context Pack
> Paste this file into your LLM system prompt or agent configuration to give
> your AI full knowledge of the Taiko blockchain ecosystem.
> Last updated: ${date}

## What is Taiko

${definition150}

## Chain Configuration
- Network: Taiko Mainnet
- Chain ID: 167000
- RPC: https://rpc.mainnet.taiko.xyz
- WSS: wss://ws.mainnet.taiko.xyz
- Explorer: https://taikoscan.io
- Bridge: https://bridge.taiko.xyz

## Key Standards
### ERC-8004 — AI Agent Identity

${ERC_8004_BLOCK}

### x402 — Agent Micropayments

${X402_BLOCK}

### Preconfirmations

${PRECONFIRM_BLOCK}

## Agent Registry
- Registry contract: ${REGISTRY_PLACEHOLDER}
- How to register: (1) Implement ERC-8004 interface; (2) Call registry on Taiko mainnet; (3) Publish capabilities and service endpoint. See docs.taiko.xyz/standards/erc-8004.
- How to query registered agents: use the registry contract \`getAgent\` / list view or query events; ethers/viem examples at docs.taiko.xyz.

## Code Snippets
### Add Taiko to viem

\`\`\`ts
import { defineChain } from 'viem'
export const taiko = defineChain({
  id: 167_000,
  name: 'Taiko Mainnet',
  nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
  rpcUrls: { default: { http: ['https://rpc.mainnet.taiko.xyz'] } },
  blockExplorers: { default: { name: 'TaikoScan', url: 'https://taikoscan.io' } },
})
\`\`\`

### Add Taiko to ethers.js v6

\`\`\`ts
const taiko = {
  chainId: 167000,
  name: 'Taiko Mainnet',
  rpcUrl: 'https://rpc.mainnet.taiko.xyz',
}
// Use with JsonRpcProvider(taiko.rpcUrl) and network 167000
\`\`\`

### Register an ERC-8004 agent

\`\`\`ts
// Call the agent registry contract on Taiko mainnet (chainId 167000).
// ABI and address: docs.taiko.xyz/standards/erc-8004
// await registry.register(agentId, metadata, endpoint)
\`\`\`

### Make an x402 payment

\`\`\`ts
// Follow x402 protocol: attach payment headers to request; settlement on Taiko.
// See docs.taiko.xyz/standards/x402 for client usage.
\`\`\`

### Query the agent registry

\`\`\`ts
// const agents = await registry.listAgents() or query AgentRegistered events
// Contract address and ABI: docs.taiko.xyz/standards/erc-8004
\`\`\`

## Deployed Protocol Addresses

| Protocol / contract | Address | Network |
|--------------------|--------|---------|
| Agent registry (ERC-8004) | See docs.taiko.xyz/standards/erc-8004 | Taiko Mainnet |

## Useful Links

| Resource | URL | Description |
|----------|-----|-------------|
| Taiko | https://taiko.xyz | Official site |
| Docs | https://docs.taiko.xyz | Developer docs |
| GitHub | https://github.com/taikoxyz | Repositories |
| TaikoScan | https://taikoscan.io | Block explorer |
| Bridge | https://bridge.taiko.xyz | L1–L2 bridge |

## Common Questions

${commonQuestions}
`;

  writeFileSync(outPath, content);
  return content;
}

function main(): void {
  generate();
  console.log("Wrote taiko-context.md");
}

main();

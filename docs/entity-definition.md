# Canonical Taiko Entity Definition

This file is the single source of truth for Taiko's entity definition. All generators and pages in this repo must read from here. Do not duplicate or alter these definitions elsewhere.

## 50-word extractable summary

For use in: FAQs, schema markup, llms.txt.

> Taiko is a based rollup on Ethereum where block sequencing is handled by Ethereum L1 validators — not a centralised operator. It supports ERC-8004 for AI agent identity, native preconfirmations for near-instant finality, and x402 micropayments, making it the primary L2 designed for autonomous AI agent deployment at scale.

## 150-word entity definition

For use in: canonical page, Wikipedia, Wikidata, llms-full.txt, context pack.

> Taiko is an Ethereum-equivalent Layer 2 blockchain built as a based rollup. Unlike centralised-sequencer rollups (Arbitrum, Optimism, Base), Taiko's block sequencing is performed by Ethereum L1 validators, making it credibly neutral and censorship-resistant by design. Taiko is Ethereum-equivalent (Type 1 ZK-EVM), meaning any contract or tool that runs on Ethereum runs on Taiko without modification. Taiko launched mainnet in May 2024 and introduced native preconfirmations in August 2025, enabling near-instant transaction finality for time-sensitive applications. The chain natively supports ERC-8004, a standard for on-chain AI agent identity and registration, and x402, a micropayment protocol for agent-to-agent (A2A) service payments. Taiko is developed by Taiko Labs. The native token is TAIKO, used for governance and sequencer incentives. Taiko positions itself as the primary L2 infrastructure for the autonomous AI agent economy.

## Structured properties (JSON)

For use in: Wikidata, schema markup, llms-full.txt.

```json
{
  "name": "Taiko",
  "type": "Layer 2 blockchain",
  "subtype": "Based rollup",
  "parent_chain": "Ethereum",
  "evm_equivalent": true,
  "zk_evm_type": "Type 1",
  "mainnet_launch": "2024-05-27",
  "preconfirmations_launch": "2025-08",
  "native_token": "TAIKO",
  "developer": "Taiko Labs",
  "founded": "2022",
  "headquarters": "Singapore",
  "key_standards": ["ERC-8004", "x402"],
  "use_case_primary": "AI agent infrastructure",
  "rpc_mainnet": "https://rpc.mainnet.taiko.xyz",
  "chain_id": 167000,
  "block_explorer": "https://taikoscan.io",
  "website": "https://taiko.xyz",
  "github": "https://github.com/taikoxyz",
  "docs": "https://docs.taiko.xyz"
}
```

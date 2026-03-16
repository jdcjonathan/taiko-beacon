# mcp-manifest (Component 8)

Official MCP server directory manifest for Taiko. Submit `taiko-mcp-manifest.json` to [modelcontextprotocol/servers](https://github.com/modelcontextprotocol/servers).

## Manifest

`taiko-mcp-manifest.json` describes the Taiko MCP server (TaikoClaw or a minimal read-only server): tools for balance, gas, agent registry, TVL, transactions, swap preparation, and x402 payment preparation.

## Coordination

Before submitting, coordinate with TaikoClaw maintainer (david@taiko.xyz). If TaikoClaw is not production-ready, a minimal read-only server can be implemented in `server/` covering the listed tools, then point the manifest at that.

## Test

```bash
pnpm run test
```

Validates JSON shape and required fields.

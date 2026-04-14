# pi-xiaomi-mimo-provider

Xiaomi Mimo provider extension for the [pi coding agent](https://github.com/badlogic/pi-mono). Registers Xiaomi Mimo models using the OpenAI-compatible API.

## Models

| Model | Context (default) | Max Context | Max Output | Reasoning | Input | Input $/MTok | Output $/MTok |
| --- | --- | --- | --- | --- | --- | --- | --- |
| MiMo V2 Pro | 128K | 1M | 16K | ✅ | Text, Image | $1.00 | $3.00 |
| MiMo V2 Omni | 128K | 1M | 16K | ✅ | Text, Image | $1.00 | $3.00 |
| MiMo V2 TTS | 128K | 1M | 16K | ❌ | Text | Free | Free |

## Installation

```bash
# From GitHub
pi install git:github.com/ulusoyomer/pi-xiaomi-mimo-provider

# From npm
pi install npm:pi-xiaomi-mimo-provider
```

## Setup

After installing, authenticate with your Xiaomi Mimo API key:

```bash
/login xiaomi-mimo
```

Get your API key at: https://platform.xiaomimimo.com/#/console/plan-manage

### Alternative: Environment Variable

You can also set your API key via environment variable:

```bash
export XIAOMI_MIMO_API_KEY="your-api-key-here"
```

Or add it to `~/.pi/agent/models.json`:

```json
{
  "providers": {
    "xiaomi-mimo": {
      "baseUrl": "https://token-plan-sgp.xiaomimimo.com/v1",
      "api": "openai-completions",
      "apiKey": "YOUR_API_KEY",
      "models": [
        { "id": "mimo-v2-pro" },
        { "id": "mimo-v2-omni" },
        { "id": "mimo-v2-tts" }
      ]
    }
  }
}
```

## Usage

Switch to a Xiaomi Mimo model:

```bash
/model mimo-v2-pro
```

## API Endpoints

| Protocol | Base URL |
| --- | --- |
| OpenAI Compatible | `https://token-plan-sgp.xiaomimimo.com/v1` |
| Anthropic Compatible | `https://token-plan-sgp.xiaomimimo.com/anthropic` |

This extension uses the OpenAI-compatible endpoint.

## Context Window

The default context window is **128K** (131072 tokens) to keep credit usage low. You can increase or change it at any time.

### Runtime Command

Use `/mimo-context` to view or change the context window without restarting:

```bash
/mimo-context           # Show current value
/mimo-context 256k      # Set to 256K
/mimo-context 512k      # Set to 512K
/mimo-context 1m        # Set to 1M (maximum)
/mimo-context 131072    # Set with a plain number
```

### Environment Variable

Set the context window at startup via environment variable:

```bash
export XIAOMI_MIMO_CONTEXT_WINDOW="256k"
```

Supported formats: `64k`, `128k`, `256k`, `512k`, `1m`, or a plain number (max 1048576).

## Reasoning Control

Toggle reasoning on/off with pi's thinking commands:

```bash
/thinking off       # Reasoning OFF
/thinking minimal   # Minimal reasoning
/thinking low       # Low reasoning
/thinking medium    # Medium reasoning
/thinking high      # Max reasoning
```

Applies to `mimo-v2-pro` and `mimo-v2-omni` only. `mimo-v2-tts` does not support reasoning.

## Notes

- The API returns `reasoning_content` in responses, which pi handles natively for reasoning models
- Default context window is 128K tokens (131072) — configurable via `XIAOMI_MIMO_CONTEXT_WINDOW` env var or `/mimo-context` command
- Maximum supported context window is 1M tokens (1048576)
- Cost values based on official Xiaomi pricing: $1/$3 per MTok (up to 256K context), $2/$6 (256K-1M context)
- Cache write is currently free per Xiaomi's pricing page

## License

MIT

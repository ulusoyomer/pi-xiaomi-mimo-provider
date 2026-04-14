# pi-xiaomi-mimo-provider

Xiaomi Mimo provider extension for the [pi coding agent](https://github.com/badlogic/pi-mono). Registers Xiaomi Mimo models using the OpenAI-compatible API.

## Models

| Model | Context | Max Output | Reasoning | Input | Input $/MTok | Output $/MTok |
| --- | --- | --- | --- | --- | --- | --- |
| MiMo V2 Pro | 1M | 16K | ✅ | Text, Image | $1.00 | $3.00 |
| MiMo V2 Omni | 1M | 16K | ✅ | Text, Image | $1.00 | $3.00 |
| MiMo V2 TTS | 1M | 16K | ❌ | Text | Free | Free |

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
- Context window is 1M tokens (1,048,576) for mimo-v2-pro and mimo-v2-omni
- Cost values based on official Xiaomi pricing: $1/$3 per MTok (up to 256K context), $2/$6 (256K-1M context)
- Cache write is currently free per Xiaomi's pricing page

## License

MIT

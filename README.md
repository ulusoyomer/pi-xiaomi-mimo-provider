# pi-mimo-provider

Xiaomi Mimo provider extension for the [pi coding agent](https://github.com/badlogic/pi-mono). Registers Xiaomi Mimo models using the OpenAI-compatible API.

## Models

| Model | Context | Max Output | Reasoning | Input |
| --- | --- | --- | --- | --- |
| MiMo V2 Pro | 128K | 16K | ✅ | Text, Image |
| MiMo V2 Omni | 128K | 16K | ✅ | Text, Image |
| MiMo V2 TTS | 128K | 16K | ❌ | Text |

## Installation

```bash
# From GitHub
pi install git:github.com/ulusoyomer/pi-mimo-provider

# From npm (when published)
pi install npm:pi-mimo-provider
```

## Setup

After installing, authenticate with your Xiaomi Mimo API key:

```bash
/login xiaomi-mimo
```

Get your API key at: https://xiaomimimo.com

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

## Notes

- The API returns `reasoning_content` in responses, which pi handles natively for reasoning models
- Cost values are set to zero — update them in `index.ts` if pricing becomes available
- Context window and max output tokens are estimated defaults — adjust if you have official values

## License

MIT

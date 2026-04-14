# Xiaomi Mimo Provider Extension Implementation Plan

> **REQUIRED SUB-SKILL:** Use the executing-plans skill to implement this plan task-by-task.

**Goal:** Create a pi coding agent extension that registers Xiaomi Mimo models (mimo-v2-pro, mimo-v2-omni, mimo-v2-tts) as a provider using the OpenAI-compatible API.

**Architecture:** Single-file extension (like pi-zai-provider) that uses `pi.registerProvider()` with `openai-completions` API. Xiaomi's API is OpenAI-compatible, supports `reasoning_content` in responses. OAuth flow prompts user for API key via `/login xiaomi-mimo`.

**Tech Stack:** TypeScript, pi extension API (`@mariozechner/pi-coding-agent`), no runtime dependencies

**API Details:**
- Base URL: `https://token-plan-sgp.xiaomimimo.com/v1`
- Models: `mimo-v2-pro`, `mimo-v2-omni`, `mimo-v2-tts`
- API response includes `reasoning_content` field (like Z.AI)
- All models support reasoning

---

### Task 1: Scaffold Project

**Files:**
- Create: `package.json`
- Create: `tsconfig.json`
- Create: `index.ts`
- Create: `README.md`
- Create: `LICENSE`

**Step 1: Create package.json**

```json
{
  "name": "pi-mimo-provider",
  "version": "1.0.0",
  "description": "Xiaomi Mimo provider extension for pi coding agent",
  "type": "module",
  "keywords": ["pi-package", "pi", "xiaomi", "mimo", "provider"],
  "license": "MIT",
  "author": "ulusoyomer",
  "repository": {
    "type": "git",
    "url": "https://github.com/ulusoyomer/pi-mimo-provider"
  },
  "files": ["index.ts", "README.md", "LICENSE"],
  "pi": {
    "extensions": ["./index.ts"]
  },
  "peerDependencies": {
    "@mariozechner/pi-ai": "*",
    "@mariozechner/pi-coding-agent": "*"
  }
}
```

**Step 2: Create tsconfig.json**

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ES2022",
    "moduleResolution": "bundler",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "allowSyntheticDefaultImports": true,
    "allowImportingTsExtensions": true,
    "noEmit": true
  },
  "include": ["index.ts"]
}
```

**Step 3: Create index.ts**

```typescript
import type { ExtensionAPI } from "@mariozechner/pi-coding-agent";
import type { OAuthCredentials, OAuthLoginCallbacks } from "@mariozechner/pi-ai";

const XIAOMI_MIMO_BASE_URL = "https://token-plan-sgp.xiaomimimo.com/v1";

export default function (pi: ExtensionAPI) {
  pi.registerProvider("xiaomi-mimo", {
    baseUrl: XIAOMI_MIMO_BASE_URL,
    api: "openai-completions",
    models: [
      {
        id: "mimo-v2-pro",
        name: "MiMo V2 Pro",
        reasoning: true,
        input: ["text", "image"],
        cost: { input: 0, output: 0, cacheRead: 0, cacheWrite: 0 },
        contextWindow: 131072,
        maxTokens: 16384,
      },
      {
        id: "mimo-v2-omni",
        name: "MiMo V2 Omni",
        reasoning: true,
        input: ["text", "image"],
        cost: { input: 0, output: 0, cacheRead: 0, cacheWrite: 0 },
        contextWindow: 131072,
        maxTokens: 16384,
      },
      {
        id: "mimo-v2-tts",
        name: "MiMo V2 TTS",
        reasoning: false,
        input: ["text"],
        cost: { input: 0, output: 0, cacheRead: 0, cacheWrite: 0 },
        contextWindow: 131072,
        maxTokens: 16384,
      },
    ],
    oauth: {
      name: "Xiaomi Mimo",
      async login(callbacks: OAuthLoginCallbacks): Promise<OAuthCredentials> {
        const apiKey = await callbacks.onPrompt({
          message: "Enter your Xiaomi Mimo API key:",
        });
        return {
          access: apiKey.trim(),
          refresh: "",
          expires: Date.now() + 365 * 24 * 60 * 60 * 1000,
        };
      },
      async refreshToken(credentials: OAuthCredentials): Promise<OAuthCredentials> {
        return credentials;
      },
      getApiKey(credentials: OAuthCredentials): string {
        return credentials.access;
      },
    },
  });
}
```

**Step 4: Create README.md** — Document models, installation, setup, usage

**Step 5: Create LICENSE** — MIT license

**Step 6: Initialize git repo**

```bash
cd /Users/omerulusoy/projects/js/pi-mimo-provider
git init
git add .
git commit -m "feat: initial pi-mimo-provider extension"
```

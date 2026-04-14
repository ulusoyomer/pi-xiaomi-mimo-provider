/**
 * Xiaomi Mimo Provider Extension for pi
 *
 * Registers Xiaomi Mimo models using the OpenAI-compatible API.
 * Supports reasoning_content in streaming responses.
 *
 * Models:
 *   - mimo-v2-pro  — Reasoning model, text & image input
 *   - mimo-v2-omni — Multimodal reasoning model, text & image input
 *   - mimo-v2-tts  — Text-to-speech model, text input
 *
 * Usage:
 *   pi install git:github.com/ulusoyomer/pi-xiaomi-mimo-provider
 *   /login xiaomi-mimo
 *   /model mimo-v2-pro
 *
 * API keys: https://xiaomimimo.com
 */

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
				cost: { input: 1.0, output: 3.0, cacheRead: 0.2, cacheWrite: 0 },
				contextWindow: 1048576,
				maxTokens: 16384,
			},
			{
				id: "mimo-v2-omni",
				name: "MiMo V2 Omni",
				reasoning: true,
				input: ["text", "image"],
				cost: { input: 1.0, output: 3.0, cacheRead: 0.2, cacheWrite: 0 },
				contextWindow: 1048576,
				maxTokens: 16384,
			},
			{
				id: "mimo-v2-tts",
				name: "MiMo V2 TTS",
				reasoning: false,
				input: ["text"],
				cost: { input: 0, output: 0, cacheRead: 0, cacheWrite: 0 },
				contextWindow: 1048576,
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
					expires: Date.now() + 365 * 24 * 60 * 60 * 1000, // 1 year
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

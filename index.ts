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
 * Configuration:
 *   Environment variable: XIAOMI_MIMO_CONTEXT_WINDOW (e.g. "128k", "1m", "524288")
 *   Default context window: 128K (131072 tokens)
 *   Runtime command: /mimo-context <size> (e.g. /mimo-context 256k)
 *
 * API keys: https://platform.xiaomimimo.com/#/console/plan-manage
 */

import type { ExtensionAPI } from "@mariozechner/pi-coding-agent";
import type { OAuthCredentials, OAuthLoginCallbacks } from "@mariozechner/pi-ai";

const XIAOMI_MIMO_BASE_URL = "https://token-plan-sgp.xiaomimimo.com/v1";
const DEFAULT_CONTEXT_WINDOW = 131072; // 128K tokens
const MAX_CONTEXT_WINDOW = 1048576; // 1M tokens

/**
 * Parse context window size from string.
 * Supports formats: "128k", "128K", "131072", "1m", "1M"
 */
function parseContextWindow(value: string | undefined, fallback: number): number {
	if (!value) return fallback;
	const normalized = value.trim().toLowerCase();
	const match = normalized.match(/^(\d+(?:\.\d+)?)\s*(k|m)?$/);
	if (!match) return fallback;
	const num = parseFloat(match[1]);
	const unit = match[2];
	if (unit === "k") return Math.round(num * 1024);
	if (unit === "m") return Math.round(num * 1024 * 1024);
	return Math.round(num);
}

/** Format token count as human-readable string */
function formatContextWindow(tokens: number): string {
	if (tokens >= 1024 * 1024 && tokens % (1024 * 1024) === 0) {
		return `${tokens / (1024 * 1024)}M`;
	}
	if (tokens >= 1024 && tokens % 1024 === 0) {
		return `${tokens / 1024}K`;
	}
	return `${tokens}`;
}

/** Current context window value (mutable for runtime updates) */
let currentContextWindow: number;

function registerMimoProvider(pi: ExtensionAPI, contextWindow: number) {
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
				contextWindow,
				maxTokens: 16384,
				compat: {
					supportsReasoningEffort: true,
					reasoningEffortMap: {
						off: "none",
						minimal: "none",
						low: "low",
						medium: "medium",
						high: "high",
					},
				},
			},
			{
				id: "mimo-v2-omni",
				name: "MiMo V2 Omni",
				reasoning: true,
				input: ["text", "image"],
				cost: { input: 1.0, output: 3.0, cacheRead: 0.2, cacheWrite: 0 },
				contextWindow,
				maxTokens: 16384,
				compat: {
					supportsReasoningEffort: true,
					reasoningEffortMap: {
						off: "none",
						minimal: "none",
						low: "low",
						medium: "medium",
						high: "high",
					},
				},
			},
			{
				id: "mimo-v2-tts",
				name: "MiMo V2 TTS",
				reasoning: false,
				input: ["text"],
				cost: { input: 0, output: 0, cacheRead: 0, cacheWrite: 0 },
				contextWindow,
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

export default function (pi: ExtensionAPI) {
	// Read context window from env var, default to 128K
	currentContextWindow = parseContextWindow(
		process.env.XIAOMI_MIMO_CONTEXT_WINDOW,
		DEFAULT_CONTEXT_WINDOW,
	);

	registerMimoProvider(pi, currentContextWindow);

	// /mimo-context command — view or change context window at runtime
	pi.registerCommand("mimo-context", {
		description: "View or set Xiaomi Mimo context window (e.g. /mimo-context 128k, /mimo-context 1m)",
		handler: async (args, ctx) => {
			const input = args?.trim();

			// No args: show current value
			if (!input) {
				ctx.ui.notify(
					`Current: ${formatContextWindow(currentContextWindow)} (${currentContextWindow} tokens). ` +
					`Usage: /mimo-context <size> (e.g. 128k, 256k, 512k, 1m)`,
					"info",
				);
				return;
			}

			const newContextWindow = parseContextWindow(input, 0);

			if (newContextWindow <= 0 || newContextWindow > MAX_CONTEXT_WINDOW) {
				ctx.ui.notify(
					`Invalid size "${input}". Use: 64k, 128k, 256k, 512k, 1m, or a number (max ${formatContextWindow(MAX_CONTEXT_WINDOW)})`,
					"error",
				);
				return;
			}

			// Update and re-register provider
			currentContextWindow = newContextWindow;
			registerMimoProvider(pi, currentContextWindow);

			ctx.ui.notify(
				`✓ Context window: ${formatContextWindow(currentContextWindow)} (${currentContextWindow} tokens)`,
				"info",
			);
		},
	});
}
